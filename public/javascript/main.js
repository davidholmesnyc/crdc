// init angular 
var app = angular.module('crcd', ['ui.router']);
// default search url 
var search_url = 'search?zipcode='



// helper functions 
var helper = {
  /**
   * ifMobile function  returns true of false based on if device is mobile or not
   * @return {[bool]} [returns true of false based on if device is mobile or not]
   */
  'ifMobile':function() {
       var check = false;
       (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
       return !check;
   },
   'openNav':function(){
      if(this.ifMobile()){
        $('.button-collapse').sideNav('show');
      }
   },
   'per':function per(num, amount){
      return Math.abs((((amount - num) / (amount)) * 100) - 100);
   },
   'sortObject':function (obj) {
      var arr = [];
      for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
              arr.push({
                  'key': prop,
                  'value': obj[prop]
              });
          }
      }
      arr.sort(function(a, b) { return a.value - b.value; });
      arr.reverse()
      //arr.sort(function(a, b) { a.value.toLowerCase().localeCompare(b.value.toLowerCase()); }); //use this to sort as strings
      return arr; // returns array
  },
  'least_likely':function (array){
      var new_array = []
      for(var x in array){
        if(array[x].value != 0 && !isNaN(array[x].value)){
          new_array.push(array[x])
        }
      }
      return new_array
  },
  'more_likely':function (x){
    var races = {
      'white':helper.per( (x.inhouse_suspension_white +  x.single_suspension_white + x.multi_suspension_white), x.enrolled_white ),
      'black':helper.per((x.inhouse_suspension_black +  x.single_suspension_black + x.multi_suspension_black), x.enrolled_black),
      'hispanic':helper.per((x.inhouse_suspension_hispanic +  x.single_suspension_hispanic + x.multi_suspension_hispanic), x.enrolled_hispanic),
      'asian':helper.per((x.inhouse_suspension_asian +  x.single_suspension_asian + x.multi_suspension_asian), x.enrolled_asian),
      'american indian':helper.per((x.inhouse_suspension_american_indian +  x.single_suspension_american_indian + x.multi_suspension_american_indian), x.enrolled_american_indian),
      'native hawaiian':helper.per((x.inhouse_suspension_native_hawaiian +  x.single_suspension_native_hawaiian + x.multi_suspension_native_hawaiian), x.enrolled_native_hawaiian),
      'multi race':helper.per((x.inhouse_suspension_multi_race +  x.single_suspension_multi_race + x.multi_suspension_multi_race), x.enrolled_multi_race),
    }
    return helper.sortObject(races)
  },
  'find_insights':function (x,column_name){
    var races = {
      'white':helper.per( x[column_name+'_white'], x.enrolled_white ),
      'black':helper.per( x[column_name+'_black'], x.enrolled_black),
      'hispanic':helper.per( x[column_name+'_hispanic'], x.enrolled_hispanic),
      'asian':helper.per( x[column_name+'_asian'], x.enrolled_asian),
      'american indian':helper.per( x[column_name+'_american_indian'], x.enrolled_american_indian),
      'native hawaiian':helper.per( x[column_name+'_native_hawaiian'], x.enrolled_native_hawaiian),
      'multi race':helper.per( x[column_name+'_multi_race'], x.enrolled_multi_race),
    }
    return helper.sortObject(races)
  },
  'races_list':function (x,column_name){
    var races = {
      
      'Black':x.enrolled_black,
      'Hispanic':x.enrolled_hispanic,
      'Asian': x.enrolled_asian,
      'American Indian': x.enrolled_american_indian,
      'Native Hawaiian':x.enrolled_native_hawaiian,
      'Multi Race':x.enrolled_multi_race,
    }
    return helper.sortObject(races)
  },
  'colors':{
    'black':'#663300',
    'hispanic':'#ffce56',
    'asian':'#ff6384',
    'american indian':'#ca6000',
    'native hawaiian':'#9fe209',
    'multi race':'#09e2c7',
    'white':'#fff2d1'
  },
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


app.controller('nav', function($scope,$http,$state) {
  var _url =$state.current.name
$scope.current_url = $state.current.name
$scope.state = $state
//$scope.current_url = 'hi'
  console.log("nav",$scope.current_url)

})
app.controller('home', function($scope,$http,$state) {
 
  $scope.buttonSearch = function(){
    if(helper.ifMobile()){
      $('.button-collapse').sideNav('hide');
    }
    var data = {zipCode:$scope.zipcode}
    if($scope.schoolType !="" && $scope.schoolType !=undefined && $scope.schoolType !='all'){
     data['schoolType'] = $scope.schoolType
    }
    $state.go('results',data)
  }
  $scope.openNav = function(){
    $('.button-collapse').sideNav('show');
  }
  $scope.profile = function(x){
    $state.go('profile',{
      x:x,
      zipcode:x.zipcode,
      school_id:x.school_id
    })
  }

  function SetUpAutocomplete(){
    fetch("./data/autocomplete.csv")
    .then(function(response){
        return response.text()
    })
    .then(function(myCSV) {
      // console.log(myCSV)
      var myCSV = myCSV.split("\n")
      var csvData = []
      for (var i = 0; i < myCSV.length; i++) {
        if(i === 0){
          continue
        }
          csvData.push(myCSV[i].split(","))
      }
      //console.log(csvData)
       var auto = new autoComplete({
           selector: 'input[name="q"]',
           minChars: 2,
           source: function(term, suggest){
               term = term.toLowerCase();
               var choices = csvData
               var matches = [];
               for (i=0; i<choices.length; i++){
                  var name = ( choices[i][1]  +" "+ choices[i][2] +","+ choices[i][3] +" "+ choices[i][4]  ).toLowerCase()
                  if (name.includes(term)) {
                      var match ={
                        "name": name,
                        "id": choices[i][4],
                        "zipcode":choices[i][4],
                        "nces_id":choices[i][0],
                        "data":choices[i]
                      }
                    matches.push(match)

                  };
              }
               suggest(matches);
           },
           renderItem: function (item, search){
               search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
               var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");

               var str = `
                  <div class="autocomplete-suggestion" data-langname="${item.name}" data-zipcode="${item.zipcode}"  data-id="${item.nces_id}" data-lang="${item.name}" data-val="${search}" style="padding:20px" >
                    
                    ${item.name.replace(re, "<b>$1</b>")}
                    
                  </div>
               `
               return str
           }

           ,  

           onSelect: function(e, term, item){

           	console.log("ITEM",item)
              $state.go('profile',{
                nces_id:item.getAttribute('data-id'),
                zipcode:item.getAttribute('data-zipcode')
              })
            }

       });

    });


  }


  SetUpAutocomplete()

});


app.controller('results', function($scope,$http,$state) {
  var whereParams = ''
  $scope.zipcode = $state.params.zipcode
  if($scope.schoolType !="" && $scope.schoolType !=undefined)
  {
    whereParams += '&schoolType='+$scope.schoolType
  }
  $http.get(search_url+$state.params.zipCode+whereParams).then(function(response) {
      $scope.myData = response.data;
      $scope.loading = false;
  });

  $scope.buttonSearch = function(){
    if(helper.ifMobile()){
      $('.button-collapse').sideNav('hide');
    }
    var data = {zipCode:$scope.zipcode}
    if($scope.schoolType !="" && $scope.schoolType !=undefined && $scope.schoolType !='all'){
     data['schoolType'] = $scope.schoolType
    }
    $state.go('results',data)
  }
  $('#autocomplete').autocomplete({
      serviceUrl: '/autocomplete',
      //deferRequestBy:100,
      dataType:'json',
      lookupLimit:10,
      onSelect: function (suggestion) {
        var x = suggestion.data
        $.getJSON('search',{profileRequest:true,zipcode:x.zipcode,school_id:x.school_id},function(data){
          $state.go('profile',{
            x:x[0],
            zipcode:x.zipcode,
            school_id:x.school_id
          })
        })
       

          console.log('You selected: ' + suggestion.value + ', ' + suggestion.data);
      }
  });
})

app.controller('profile', function($scope,$http,$state) {




  function createPieChart(id,data){
    var ctx = document.getElementById(id);
    var labels = []
    var new_data = []
    var race_colors = []
    for(var b in data){
        labels.push(data[b].key)
        new_data.push(data[b].value.toFixed(2))
        race_colors.push(helper.colors[data[b].key.toLowerCase()])

    }
    var data = {
        labels:labels,
        datasets: [{
          data: new_data,
          backgroundColor: race_colors,
          hoverBackgroundColor: race_colors
        }]
    };
    // For a pie chart
    var myPieChart = new Chart(ctx,{
        type: 'pie',
        data: data,
        options:{
          'position':'left',
          'legend':{
            'position':'bottom',
            'display':false
          }
        }
        
    });
  }

  function countNumbers(column,data,OnlyMiniority){
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
      var total = 0 
      for(var key in races){
        if(OnlyMiniority && key === "WH"){continue};
        var race = races[key]
        total += parseInt(data[column+"_"+key+"_M"]) + parseInt(data[column+"_"+key+"_F"] )
        // query_string += "cast(data->>'"+column_preface+"_"+key+"_M' as int) + cast(data->>'"+column_preface+"_"+key+"_F' as int) as "+alias_preface+"_"+races[key]
        if(key != last){
          query_string +=','
        }
      }
      return total
    }
  function addRaceToObject(CRCDcolumn,NewColumn,x,OnlyMiniority){
      var races = {
        'HI':'hispanic',
        'AM':'American_indian',
        'AS':'asian',
        'HP':'native_hawaiian',
        'BL':'black',
        'TR':'multi_race',
        'WH':'white'
      } 
      var query_string = ''
      var keys = Object.keys(races);
      var last = keys[keys.length-1];
      var total = 0 
      for(var key in races){
        if(OnlyMiniority && key === "WH"){continue};
        var race = races[key]
        x[NewColumn+"_"+races[key]] = parseInt(x[CRCDcolumn+"_"+key+"_M"]) + parseInt(x[CRCDcolumn+"_"+key+"_F"] )
        // query_string += "cast(data->>'"+column_preface+"_"+key+"_M' as int) + cast(data->>'"+column_preface+"_"+key+"_F' as int) as "+alias_preface+"_"+races[key]
        if(key != last){
          query_string +=','
        }
      }
      return x
    }

  
  $scope.showProfile =  function(x){
     scroll(0,0)
     // hacks to use frontned instead of back
     x["inhouse_suspension"] = helper.all_races_query("SCH_DISCWODIS_ISS","inhouse_suspension")
     x["School_Name"] = x["SCH_NAME"]
     x["total_students"] = parseInt(x["TOT_ENR_F"]) + parseInt(x["TOT_ENR_M"])
     x["total_miniorities"] = countNumbers("SCH_ENR",x,true)
     x["total_teachers"] = x["SCH_FTETEACH_TOT"]
     x["total_suspended"] = countNumbers("SCH_DISCWODIS_MULTOOS",x,false) +   countNumbers("SCH_DISCWODIS_SINGOOS",x,false) + countNumbers("SCH_DISCWODIS_ISS",x,false)
     x = addRaceToObject("SCH_ENR","enrolled",x,false)
     x = addRaceToObject("SCH_DISCWODIS_MULTOOS","multi_suspension",x,false)
     x = addRaceToObject("SCH_DISCWODIS_SINGOOS","single_suspension",x,false)
     x = addRaceToObject("SCH_DISCWODIS_ISS","inhouse_suspension",x,false)
     x = addRaceToObject("SCH_GTENR","gifted_students",x,false)

     $scope.modal = {}
     $scope.modal.schoolName = x["SCH_NAME"]
     $scope.modal.location = x["CITY"]+","+x["LEA_STATE"] 
     $scope.absent_teachers = helper.per(x["SCH_FTETEACH_ABSENT"], x["SCH_FTETEACH_TOT"])

     b = x
     // console.log(x)
     // select(knex.raw(helper.all_races_query("SCH_ENR","enrolled"))). 
     // select(knex.raw(helper.all_races_query("SCH_DISCWODIS_MULTOOS","multi_suspension"))).    
     // select(knex.raw(helper.all_races_query("SCH_DISCWODIS_SINGOOS","single_suspension"))).    
     // select(knex.raw(helper.all_races_query("SCH_DISCWODIS_ISS","inhouse_suspension"))).     
     // select(knex.raw(helper.all_races_query("SCH_GTENR","gifted_students"))).     
     // select(knex.raw(helper.all_races_query("SCH_HBDISCIPLINED_RAC","bullied_or_harrassed_students"))).     
     // select(knex.raw(helper.all_races_query("SCH_DISCWODIS_ARR","arrested"))).     
     // select(knex.raw(helper.all_races_query("SCH_DISCWODIS_REF","ref_arrested"))).



     var likely = helper.more_likely(x)
     var find_gifted_students_insights = helper.find_insights(x,'gifted_students')
     var races_insights = helper.find_insights(x,'enrolled')
     var ctx = document.getElementById("race-chart");
     var races = helper.least_likely(likely)
     var enrolled_chart 
     $scope.x = x 
     $scope.most_likely = helper.least_likely(likely)[0]
     $scope.gifted_students = find_gifted_students_insights[0]
     $scope.least_gifted_students = helper.least_likely(find_gifted_students_insights).slice(-1)[0]
     $scope.least_likey = helper.least_likely(likely).slice(-1)[0]
     $scope.diversetyPercentage = Math.abs((((x.total_students - x.total_miniorities) / x.total_students) * 100) - 100).toFixed(0)
    

     $scope.highest_races = helper.races_list(x)[0]
     var data = {
         labels: ["White", "Black", "Hispanic", "Asian", "American Indian", "Native Hawaiian", "Multi race"],
         datasets: [
           {
               label: "All Students",
               backgroundColor: "rgba(64,196,255,0.2)",
               borderColor: "rgba(64,196,255,1)",
               borderWidth: 1,
               hoverBackgroundColor: "rgba(64,196,255,0.2)",
               hoverBorderColor: "rgba(64,196,255,1)",
               data: [
                 x.enrolled_white , 
                 x.enrolled_black, 
                 x.enrolled_hispanic,
                 x.enrolled_asian,
                 x.enrolled_american_indian,
                 x.enrolled_native_hawaiian,
                 x.enrolled_multi_race
               ],
           },
           {
             label: "Gifted Studens",
             backgroundColor: "rgba(223, 240, 216, 0.51)",
             borderColor: "rgba(223, 240, 216, 0.51)",
             borderWidth: 1,
             hoverBackgroundColor: "rgba(223, 240, 216, 0.51)",
             hoverBorderColor: "rgba(223, 240, 216, 0.51)",
             data: [
               x.gifted_students_white,
               x.gifted_students_black ,
               x.gifted_students_hispanic,
               x.gifted_students_asian,
               x.gifted_students_american_indian,
               x.gifted_students_native_hawaiian,
               x.gifted_students_multi_race
             ],
           },
           {
             label: "Suspensions",
             backgroundColor: "rgba(255,99,132,0.4)",
             borderColor: "rgba(255,99,132,1)",
             borderWidth: 1,
             hoverBackgroundColor: "rgba(255,99,132,0.4)",
             hoverBorderColor: "rgba(255,99,132,1)",
             data: [
               (x.inhouse_suspension_white +  x.single_suspension_white + x.multi_suspension_white),
               (x.inhouse_suspension_black +  x.single_suspension_black + x.multi_suspension_black),
               (x.inhouse_suspension_hispanic +  x.single_suspension_hispanic + x.multi_suspension_hispanic),
               (x.inhouse_suspension_asian +  x.single_suspension_asian + x.multi_suspension_asian),
               (x.inhouse_suspension_american_indian +  x.single_suspension_american_indian + x.multi_suspension_american_indian),
               (x.inhouse_suspension_native_hawaiian +  x.single_suspension_native_hawaiian + x.multi_suspension_native_hawaiian),
               (x.inhouse_suspension_multi_race +  x.single_suspension_multi_race + x.multi_suspension_multi_race)
             ],
           }
           
         ]
     };
    enrolled_chart = new Chart(ctx, { type: 'bar', data: data });
    createPieChart('pie-chart',races)
    createPieChart('gifted-students-pie-chart',helper.find_insights(x,'gifted_students'))
  }

  if($state.params.x !=null)
  {
    $scope.showProfile($state.params.x)
  }
  else
  {

    var url = "./data/crdc_data_by_zip_json/"+$state.params.zipcode+"/"+$state.params.nces_id+".json"
    $http.get(url).then(function(response) {

      $scope.showProfile(response.data)
    })
  }
})

app.config(function($stateProvider, $urlRouterProvider) {

// For any unmatched url, redirect to /state1
$urlRouterProvider.otherwise("/");
//
// Now set up the states
$stateProvider

  .state('home', {
    url: "/",
    templateUrl: "pages/home.html",
    controller: 'home'
  })
  .state('results', {
    url: "/results/:zipCode?schoolType",
    templateUrl: "pages/results.html",
    controller:'results'
  })
  .state('maps', {
    url: "/maps",
    templateUrl: "pages/maps.html",
    controller:function($scope){

      Plotly.d3.csv('/data/states-total-students-vs-minorities.csv', function(err, rows){
            function unpack(rows, key) {
                return rows.map(function(row) { return row[key]; });
            }
      $scope.diversity = rows
      $scope.$digest();
      var data = [{
                    type: 'choropleth',
                    locationmode: 'USA-states',
                    locations: unpack(rows, 'state'),
                    z: unpack(rows, 'percent'),
                    
                    autocolorscale: false,
                    colorscale:[ [0, 'rgb(255,0,0)'], [.5, 'rgb(83, 106, 194)'] , [1, 'rgb(0,0,255)']   ]
                }];
      
      console.log("test",$scope.diversity)
      var layout = {
                title: '2013-2014 US Student Diversity Percentage',
                geo:{
                  scope: 'usa',
                  countrycolor: 'rgb(255, 255, 255)',
                  showland: true,
                  landcolor: 'rgb(217, 217, 217)',
                  showlakes: true,
                  lakecolor: 'rgb(255, 255, 255)',
                  subunitcolor: 'rgb(255, 255, 255)',
                  lonaxis: {},
                  lataxis: {}
                }
            };
            Plotly.plot(student_diversity_by_state, data, layout, {showLink: false});
        });
    }
  })
  .state('profile', {
    url: "/profile/:zipcode/:nces_id",
    params:{
      x:null
    },
    templateUrl: "pages/profile.html",
    controller:'profile'
  });
});