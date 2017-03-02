'use strict'
var cities = require('cities');
var express = require('express');
const port = 3001
var app = express();

var config = require("./config/config.js")
var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : config.DB_HOST,
    user     : config.DB_USER,
    password : config.DB_PASSWORD,
    database : config.DB_DATABASE
  }
});
var helper = {
  /**
   * all_races_query 
   * @param  {[type]} column_preface [this is the preface of the crcd column without the race]
   * @param  {[type]} alias_preface  [this is the preface for the race alias when we output to json]
   * @return {[type]}                [this function is an easy way to create queries for multiple races in the crcd data ]
   */
  'all_races_query':function(column_preface,alias_preface){
    var races = {
      'HI':'Hispanic',
      'AM':'American_Indian',
      'AS':'asian',
      'HP':'Native_Hawaiian',
      'BL':'black',
      'TR':'multi_race',
      'WH':'white'
    } 
    var query_string = ''
    var keys = Object.keys(races);
    var last = keys[keys.length-1];
    for(var key in races){
      var race = races[key]
      query_string += "cast(data->>'"+column_preface+"_"+key+"_M' as int) + cast(data->>'"+column_preface+"_"+key+"_F' as int) as "+alias_preface+"_"+races[key]
      if(key != last){
        query_string +=','
      }
    }
    return query_string
  }
}
/* future use for public API with no tokens
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
*/
// express use public folder for static files 
app.use(express.static('public'));
/**
 * CRCD search API 
 * @param  {[obj]} req  [express request object]
 * @param  {[obj]} res) [express response object]
 * @param  [api-param][school_type] 
 * @return {[json]}      [returns results in json]
 * 
 */
app.get('/search', function(req, res) {
  // if zipcode 
  if(req.query.zipcode !=undefined){
    var geo = cities.zip_lookup(req.query.zipcode)
    var whereString = "data->>'LEA_STATE' =? and data->>'city' =? and data->>'zipcode' =? "
    var whereParams = [geo['state'],geo['city'],req.query.zipcode]
  }else{
    var whereString = "data->>'LEA_STATE' =? and data->>'city' =? "
    var whereParams = [req.query.state,req.query.city]
  }

  // if schooltype ['elem','middle','high']
  if(req.query.schoolType !=undefined && req.query.schoolType !="" ){

    switch (req.query.schoolType) {
        case 'elem':
            whereString += "and  data->>'SCH_GRADE_G01' =?"
            break;
        case 'middle':
            whereString += " and data->>'SCH_GRADE_G07' =?"
            break;
        case 'high':
            whereString += " and data->>'SCH_GRADE_G10' =?"
            break;
    }
    whereParams.push('YES')
  }
  if(req.query.school_id !=undefined && req.query.school_id !=""){
    whereString += "and data->>'SCHID' =?"
    whereParams.push(req.query.school_id)
  }
  // run the query 
  var run = knex.withSchema('education').
  select(knex.raw("data->>'SCH_NAME' as School_Name")).
  select(knex.raw("data->>'SCHID' as School_ID")).
  select(knex.raw("cast(data->>'TOT_ENR_F' as int) + cast(data->>'TOT_ENR_M' as int) as total_students")).
  select(knex.raw("data->>'city' as city")).
  select(knex.raw("data->>'LEA_STATE' as state")).
  select(knex.raw("data->>'zipcode' as zipcode")).
  select(knex.raw("data->>'SCH_FTETEACH_TOT' as total_teachers")).  
  select(knex.raw("data->>'SCH_FTETEACH_ABSENT' as absent_teachers")).  
  select(knex.raw("data->>'SCH_FTESECURITY_IND' as security")).  
  select(knex.raw("data->>'SCH_FTETEACH_FY' as first_year_teachers")).  
  select(knex.raw("data->>'SCH_FTECOUNSELORS' as counselors")).  
  select(knex.raw("data->>'SCH_CORPINSTANCES_IND' as corporal_punishment")).  
  select(knex.raw(helper.all_races_query("SCH_ENR","enrolled"))). 
  select(knex.raw(helper.all_races_query("SCH_DISCWODIS_MULTOOS","multi_suspension"))).    
  select(knex.raw(helper.all_races_query("SCH_DISCWODIS_SINGOOS","single_suspension"))).    
  select(knex.raw(helper.all_races_query("SCH_DISCWODIS_ISS","inhouse_suspension"))).     
  select(knex.raw(helper.all_races_query("SCH_GTENR","gifted_students"))).     
  select(knex.raw(helper.all_races_query("SCH_HBDISCIPLINED_RAC","bullied_or_harrassed_students"))).     
  select(knex.raw(helper.all_races_query("SCH_DISCWODIS_ARR","arrested"))).     
  select(knex.raw(helper.all_races_query("SCH_DISCWODIS_REF","ref_arrested"))).     
 
  select(knex.raw(" cast(data->>'TOT_DISCWODIS_ISS_M' as int) + cast(data->>'TOT_DISCWODIS_ISS_F' as int) + cast(data->>'TOT_PSDISC_MULTOOS_M' as int) + cast(data->>'TOT_PSDISC_MULTOOS_F' as int) + cast(data->>'TOT_DISCWDIS_ISS_IDEA_M' as int) + cast(data->>'TOT_DISCWDIS_ISS_IDEA_F' as int) + cast(data->>'TOT_DISCWDIS_MULTOOS_IDEA_M' as int) + cast(data->>'TOT_DISCWDIS_MULTOOS_IDEA_F' as int) as total_suspended")).
  select(knex.raw("cast(data->>'SCH_ENR_HI_M' as int) + cast(data->>'SCH_ENR_HI_F' as int) + cast(data->>'SCH_ENR_AM_M' as int) + cast(data->>'SCH_ENR_AM_F' as int) + cast(data->>'SCH_ENR_AS_M' as int) + cast(data->>'SCH_ENR_AS_F' as int) + cast(data->>'SCH_ENR_HP_M' as int) + cast(data->>'SCH_ENR_HP_F' as int) + cast(data->>'SCH_ENR_BL_M' as int) + cast(data->>'SCH_ENR_BL_F' as int) + cast(data->>'SCH_ENR_TR_M' as int) + cast(data->>'SCH_ENR_TR_F' as int) as total_miniorities")).
  from('crcd').
  whereRaw(whereString,whereParams).
  orderBy('total_students','desc').
  then(function(rows){
    // send json response to client
    res.end(JSON.stringify(rows));
  }).catch(function(e){
    // if error show that to the console
    console.log("query error",e)
  })
  //res.send('user ' + req.params.zip);
});
// express listen on port 
app.listen(port, function () {
  console.log('App listening on port '+port+ " http://localhost:3001/");
});

