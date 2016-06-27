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
}
// angular controller
app.controller('myCtrl', function($scope,$http,$state) {
  console.log("state",$state)
  $scope.zipcode = $state.params.zipcode
  console.log("scope",$scope.zipcode)
  $scope.search = function(zipcode,schoolType){
    $scope.loading = true;
    console.log("zip",$scope.zipcode)
    if(helper.ifMobile){
      $('.button-collapse').sideNav('hide')
    }
    var whereParams =''
    console.log("selected",$scope.schoolType)
    if($scope.schoolType !="" && $scope.schoolType !=undefined){
      whereParams += '&schoolType='+$scope.schoolType
    }


    $http.get(search_url+$state.params.zipCode+whereParams).then(function(response) {
        $scope.myData = response.data;
        $scope.loading = false;
    });
  }
  if($state.current.name === 'profile'){
    $scope.profile()
  }
  if($state.current.name === 'results'){
    $scope.search()
  }
  $scope.buttonSearch = function(){
    var data = {zipCode:$scope.zipcode}
     
    if($scope.schoolType !="" && $scope.schoolType !=undefined && $scope.schoolType !='all'){
     data['schoolType'] = $scope.schoolType
    }
    $state.go('results',data)
  }
  $scope.profile = function(x){
    $scope.loading = true;
    
    if(x === undefined){
      $http.get(search_url+$state.params.zipcode+"&school_id="+$state.params.school_id).then(function(response) {
          $scope.loading = false;
          console.log("test",response.data[0])
          $scope.showProfile(response.data[0])
      });
    }else{
      $state.go('profile',{
        x:x,
        zipcode:x.zipcode,
        school_id:x.school_id
      })
    }

  }

  function createPieChart(id,data){
    var ctx = document.getElementById(id);
    var labels = []
    var new_data = []
    for(var b in data){
        labels.push(data[b].key)
        new_data.push(data[b].value.toFixed(2))
    }
    var data = {
        labels:labels,
        datasets: [
            {
                data: new_data,
                backgroundColor: [
                   "#FF6384",
                   "#663300",
                   "#FFCE56",
                   "#cbcace",
                   "#009900"
                ],
                hoverBackgroundColor: [
                   "#FF6384",
                   "#663300",
                   "#FFCE56",
                   "#cbcace",
                   "#009900"
                ]
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
    $scope.showProfile = function(x){
      scroll(0,0)
  

      var likely = helper.more_likely(x)
      $scope.x = x 
      $scope.most_likely = helper.least_likely(likely)[0]
      var find_gifted_students_insights = helper.find_insights(x,'gifted_students')
      var races_insights = helper.find_insights(x,'enrolled')
      console.log("race-insight",races_insights)
      $scope.gifted_students = find_gifted_students_insights[0]
      $scope.least_gifted_students = helper.least_likely(find_gifted_students_insights).slice(-1)[0]
      $scope.least_likey = helper.least_likely(likely).slice(-1)[0]
      $scope.diversetyPercentage = Math.abs((((x.total_students - x.total_miniorities) / x.total_students) * 100) - 100).toFixed(0)
      $scope.modal = {}
      $scope.modal.schoolName = x.school_name
      $scope.modal.location = x.city+","+x.state
      $scope.absent_teachers = helper.per(x.absent_teachers, x.total_teachers)
      //$('#modal1').showProfile();

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
     var ctx = document.getElementById("race-chart");
      var myBarChart = new Chart(ctx, {
          type: 'bar',
          data: data
      });
      
     var races = helper.least_likely(likely)
     $scope.highest_races = helper.races_list(x)[0]
     createPieChart('pie-chart',races)
     createPieChart('gifted-students-pie-chart',helper.find_insights(x,'gifted_students'))
     //createPieChart('pie-chart',{labels:labels,data:data})
     console.log("x",x)
    }
  
});



$(function(){
  $('.modal-trigger').leanModal();
  $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 240
        edge: 'left', // Choose the horizontal origin
        closeOnClick: false // Closes side-nav on <a> clicks, useful for Angular/Meteor
      }
    );
  
})

app.config(function($stateProvider, $urlRouterProvider) {
//
// For any unmatched url, redirect to /state1
$urlRouterProvider.otherwise("/");
//
// Now set up the states
$stateProvider

  .state('home', {
    url: "/",
    templateUrl: "pages/home.html",
    controller: 'myCtrl'
  })
  .state('results', {
    url: "/results/:zipCode?schoolType",
    templateUrl: "pages/results.html",
    controller:'myCtrl'
  })
  .state('profile', {
    url: "/profile/:zipcode/:school_id",
    params:{
      x:null
    },
    templateUrl: "pages/profile.html",
    controller:'myCtrl'
  });
});