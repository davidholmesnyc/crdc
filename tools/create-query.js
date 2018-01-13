'use strict'
var cities = require('cities');
var express = require('express');
const port = 3001
var app = express();

var config = require(".././config/config.js")
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
     // query_string += "SUM(cast(data->>'"+column_preface+"_"+key+"_M' as int) + cast(data->>'"+column_preface+"_"+key+"_F' as int)) as "+alias_preface+"_"+races[key]
      //query_string += "SUM(cast(data->>'"+column_preface+"_"+key+"_M' as int)) as "+alias_preface+"_"+races[key]+"_M , SUM(cast(data->>'"+column_preface+"_"+key+"_F' as int)) as "+alias_preface+"_"+races[key]+"_F"
      query_string += "cast(data->>'"+column_preface+"_"+key+"_M' as int) as "+alias_preface+"_"+races[key]+"_M , cast(data->>'"+column_preface+"_"+key+"_F' as int) as "+alias_preface+"_"+races[key]+"_F"
      if(key != last){
        query_string +=','
      }
    }
    return query_string
  }
}

/*
  for (var i = autocomplete.length - 1; i >= 0; i--) {
     var a = autocomplete[i]
     var a = a.toLowerCase() 
     var q = term.toLowerCase()
     if (a.indexOf(q) !== -1) {
       var get_data_info = a.split("--")
       //console.log("get_data_info",get_data_info)
       //2209 -- asbury elem sch -- albertville -- 35951
       data.push({
         value:a,
         data:{
           school_id:trim1(get_data_info[0]),
           school_name:trim1(get_data_info[1]),
           school_city:trim1(get_data_info[2]),
           zipcode:trim1(get_data_info[3]),
          }
       })
     }
   }
*/

 var whereString = ''
/*
// if zipcode 
if(req.query.zipcode !=undefined && req.query.profileRequest == undefined){
  var geo = cities.zip_lookup(req.query.zipcode)
  var whereString = "data->>'LEA_STATE' =? and data->>'city' =? and data->>'zipcode' =? "
  var whereParams = [geo['state'],geo['city'],req.query.zipcode]
}else{
  var whereString = "data->>'LEA_STATE' =? and data->>'city' =? "
  var whereParams = [req.query.state,req.query.city]
}
if(req.query.profileRequest !=undefined){
   var geo = cities.zip_lookup(req.query.zipcode)
   console.log("geo",geo)
   var whereString = "data->>'LEA_STATE' =? and data->>'city' =? and data->>'zipcode' =? and data->>'SCHID' =? "
   var whereParams = [geo['state'],geo['city'],req.query.zipcode,req.query.school_id] 
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
*/
// run the query 

var run = 
knex.withSchema('education').
select(knex.raw("data->>'LEA_STATE' as state")).  
//select(knex.raw("SUM( cast(data->>'TOT_ENR_F' as int) + cast(data->>'TOT_ENR_M' as int)) as total_students")).
select(knex.raw("SUM( cast(data->>'TOT_ENR_M' as int)) as male_students")).
select(knex.raw("SUM( cast(data->>'TOT_ENR_F' as int)) as female_students")).
//select(knex.raw("SUM(data->>'SCH_CORPINSTANCES_IND') as corporal_punishment")).  
select(knex.raw(helper.all_races_query("SCH_ENR","enrolled"))). 
select(knex.raw(helper.all_races_query("SCH_DISCWODIS_MULTOOS","multi_suspension"))).    
select(knex.raw(helper.all_races_query("SCH_DISCWODIS_SINGOOS","single_suspension"))).    
select(knex.raw(helper.all_races_query("SCH_DISCWODIS_ISS","inhouse_suspension"))).     
select(knex.raw(helper.all_races_query("SCH_GTENR","gifted_students"))).     
select(knex.raw(helper.all_races_query("SCH_HBDISCIPLINED_RAC","bullied_or_harrassed_students"))).     
select(knex.raw(helper.all_races_query("SCH_DISCWODIS_ARR","arrested"))).     
select(knex.raw(helper.all_races_query("SCH_DISCWODIS_REF","ref_arrested"))).
from('crcd').
groupByRaw("data->>'LEA_STATE'")
.toSQL()


var run = 
knex.withSchema('education').
select(knex.raw("data->>'LEA_STATE' as state")).  
//select(knex.raw("SUM( cast(data->>'TOT_ENR_F' as int) + cast(data->>'TOT_ENR_M' as int)) as total_students")).
select(knex.raw(" cast(data->>'TOT_ENR_M' as int) as male_students")).
select(knex.raw("cast(data->>'TOT_ENR_F' as int) as female_students")).
//select(knex.raw("SUM(data->>'SCH_CORPINSTANCES_IND') as corporal_punishment")).  
select(knex.raw(helper.all_races_query("SCH_ENR","enrolled"))). 
select(knex.raw(helper.all_races_query("SCH_DISCWODIS_MULTOOS","multi_suspension"))).    
select(knex.raw(helper.all_races_query("SCH_DISCWODIS_SINGOOS","single_suspension"))).    
select(knex.raw(helper.all_races_query("SCH_DISCWODIS_ISS","inhouse_suspension"))).     
select(knex.raw(helper.all_races_query("SCH_GTENR","gifted_students"))).     
select(knex.raw(helper.all_races_query("SCH_HBDISCIPLINED_RAC","bullied_or_harrassed_students"))).     
select(knex.raw(helper.all_races_query("SCH_DISCWODIS_ARR","arrested"))).     
select(knex.raw(helper.all_races_query("SCH_DISCWODIS_REF","ref_arrested"))).
from('crcd').
toSQL()



console.log(run.sql.replace(/\\/g, ""))

process.exit()


