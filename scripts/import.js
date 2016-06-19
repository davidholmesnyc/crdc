'use strict';
//./pgfutter  --db "postgres" --user "postgres" --pw "postgres" --schema "education" --table "crcd" --jsonb  json crcd.json
// geo index for postgres  
//  CREATE INDEX geodata_index ON education.crcd ((data->>'LEA_STATE'),(data->>'city'),(data->>'zipcode'));
//  CREATE INDEX school_id ON education.crcd ((data->>'SCHID'));
var fs = require('fs');
var config = require('../config/config.js')
var sprintf = require("sprintf-js").sprintf
var cities = require('cities');
var pgfutter = __dirname+'/pgfutter  --db "'+config.DB_DATABASE+'" --user "'+config.DB_USER+'" --pw "'+config.DB_PASSWORD+'" --schema "'+config.DB_SCHEMA+'" --table "'+config.DB_TABLE+'" --jsonb json '+ __dirname+'/files/'+config.CRCD_JSON_FILE+''

var pgfutter = '--db '+config.DB_DATABASE+' --user '+config.DB_USER+' --pw '+config.DB_PASSWORD+' --schema '+config.DB_SCHEMA+' --table '+config.DB_TABLE+' --jsonb json '+ __dirname+'/files/'+config.CRCD_JSON_FILE+''

//var t = pgfutter.split( ")

var spawn = require('child_process').spawn;

//console.log("test",pgfutter.split(" "))
/*
var opt = ['--db"'+config.DB_DATABASE+'"',
'--user"'+config.DB_USER+'"',
'--pw"'+config.DB_PASSWORD+'"',
'--schema"'+config.DB_SCHEMA+'"',
'--table"'+config.DB_TABLE+'"',
'--jsonb','json',
'--db "'+config.DB_DATABASE+'"',
__dirname+'/files/'+config.CRCD_JSON_FILE

]
console.log(opt)
*/
var Converter= require("csvtojson").Converter;
var csvConverter= new Converter({constructResult:false}); // The parameter false will turn off final result construction. It can avoid huge memory consumption while parsing. The trade off is final result will not be populated to end_parsed event.
var readStream= require("fs").createReadStream(__dirname+"/files/"+config.CRCD_CSV_FILE);
var wstream = fs.createWriteStream(__dirname+'/files/'+config.CRCD_JSON_FILE);
var cities = require('cities');
var gps = require('gps2zip');
var sys = require('sys')
var exec = require('child_process').exec;
var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : config.DB_HOST,
    user     : config.DB_USER,
    password : config.DB_PASSWORD,
    database : config.DB_DATABASE
  }
});
readStream.pipe(csvConverter)
console.log("converting csv to json..this can take a while")
csvConverter.on("record_parsed",function(resultRow,rawRow,rowIndex){
  process.stdout.write("processing row " + rowIndex + "\r");
  if(resultRow['CCD_LATCOD'] != '' && resultRow['CCD_LONCOD'] !='')
  {
    resultRow['zipcode'] = sprintf("%05d", gps.gps2zip(resultRow['CCD_LATCOD'],resultRow['CCD_LONCOD'])['zip_code'])
    resultRow['city'] = cities.zip_lookup(resultRow['zipcode'])['city']
    //console.log(resultRow['zipcode']+" "+resultRow['city'])
    wstream.write(JSON.stringify(resultRow)+'\n');
  }else
  {
    resultRow['zipcode'] = 'null'
    resultRow['city'] =  'null'
    wstream.write(JSON.stringify(resultRow)+'\n');
  }
})

csvConverter.on("end_parsed", function(jsonObj) {
  console.log("importing json into postgres..this could take a while")
  /*
  var child = require('child_process').exec(pgfutter)
    child.stdout.pipe(process.stdout)
  */
 
  var child = spawn(__dirname+"/pgfutter", pgfutter.split(" "), { stdio: 'inherit' });
  child.on('close', function() {
    console.log("creating index on db for faster queries.. could take a while")
    knex.raw("CREATE INDEX school_id ON education.crcd ((data->>'SCHID'));CREATE INDEX geodata_index ON education.crcd ((data->>'LEA_STATE'),(data->>'city'),(data->>'zipcode'));")
    .then(function(err,data){
      console.log("finished -- you can now start the server using npm start")
      process.exit()
    }).catch(function(e){
      console.log("cant index the db because of an error",e)
      process.exit()
    })
  })
});







