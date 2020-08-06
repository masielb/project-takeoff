// Fire the foundation plugins
$(document).foundation();

// NASA Insight API 
var weatherURL = "https://api.nasa.gov/insight_weather/?api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8&feedtype=json&ver=1.0"

$.ajax({
   url: "https://api.nasa.gov/insight_weather/?api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8&feedtype=json&ver=1.0",
   method: "GET"
}).then(function(response) {
   console.log(response);
  /// write a function to get data we want and transfer to a readable display
   $.get(
    `https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0&api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8`,
 data => {
   data.sol_keys.forEach(sol => write_sol_data(sol, data[sol]));
   $("#summary").append('<hr>');
 }
).always(
 function(data) {
   // Write JSON stream to #json PRE
   $("#json").text(JSON.stringify(data, null, 2));
   if (one_sol) {
       plot_sol_data(one_sol, data[one_sol]);
   }
});

function write_sol_data(sol, sol_obj) {
  // Summarize per-Sol temperature data to #summary DIV
  $('#summary').append( `Sol <b>${sol}</b> Hi:  <b>${Math.round(sol_obj.AT.mn)}&deg;C</b> Low: <b>${Math.round(sol_obj.AT.mx)}&deg;C</b>Atmospheric pressure <b>${Math.round(sol_obj.PRE.mn)} Pa</b> to <b>${Math.round(sol_obj.PRE.mx)} Pa</b>.<br>`);
  console.log(sol, sol_obj);

  one_sol = sol;
};

var year = "";
var month = "";
var day = "";
var photoDate = "";
var roverName = "";
var earthDateArr = [];
var yearArr = [];
var monthArr = [];
var dayArr = [];

function getYear() {
   $(".buttons").empty();
   for(var k = 0; k < yearArr.length; k++) {
      var yearBtn = $("<button>").addClass("years").attr("data-year", yearArr[k]).text(yearArr[k]);
      $(".buttons").append(yearBtn);
   };
   
   $(".years").on("click", function() {
   year = $(this).attr("data-year");
   getMonth();
   });
};

function getMonth() {
   $(".buttons").empty();
   for (var l = 0; l < earthDateArr.length; l++) {
      if(earthDateArr[l].includes(year)){
         month = moment(earthDateArr[l]).format("MM");
         if(monthArr.indexOf(month) === -1) {
            monthArr.push(month);
         };  
      };
   };
   for(var m = 0; m < monthArr.length; m++) {
      var monthBtn = $("<button>").addClass("months").attr("data-month", monthArr[m]).text(moment(monthArr[m], "MM").format("MMMM"));
      $(".buttons").append(monthBtn);
   };
   $(".months").on("click", function() {
      month = $(this).attr("data-month");
      getDay();
   });
};

function getDay() {
   $(".buttons").empty();
   for (var n = 0; n < earthDateArr.length; n++) {
      daySearch = year + "-" + month
      if(earthDateArr[n].includes(daySearch)) {
         day = moment(earthDateArr[n]).format("DD");
         if(dayArr.indexOf(day) === -1){
            dayArr.push(day);
         };
      };
   };
   for (var p = 0; p < dayArr.length; p++) {
      var dayBtn = $("<button>").addClass("days").attr("data-day", dayArr[p]).text(dayArr[p]);
      $(".buttons").append(dayBtn);
   };
   $(".days").on("click", function() {
      day = $(this).attr("data-day");
      confirmDate();
   });
};

function confirmDate() {
   $(".buttons").empty();
   photoDate = year + "-" + month + "-" + day
   confirmBtn = $("<button>").addClass("confirm").text(photoDate);
   cancelBtn = $("<button>").text("Re-do");
   confirmEl = $("<h3>").text("Please confirm your search date:");
   $(".buttons").append(confirmEl, confirmBtn, cancelBtn);

   $(".confirm").on("click", displayPhotos);
   

   console.log("Your date is:" + photoDate);
};

// NASA Rover Photos
function displayPhotos() {
   $.ajax({
      url: "https://api.nasa.gov/mars-photos/api/v1/rovers/" + roverName + "/photos?earth_date=" + photoDate + "&api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8",
      method: "GET"
   }).then(function(response) {
      console.log(response);
      console.log(photoDate);
      console.log(roverName);
      $(".rover-imgaes").show();
      var pics = response.photos
      for(var j = 0; j < pics.length; j++) {
         var mastCam = pics[j].camera.name.includes("MAST");
         console.log(mastCam);
         var panCam = pics[j].camera.name.includes("PANCAM");
         if(mastCam === true || panCam === true){
            var imgSrc = response.photos[j].img_src
            console.log(imgSrc);
            var imgEl = $("<img>").attr("src", imgSrc);
            $(".rover-images").append(imgEl);
         };
      };
   });
};

// When user clicks a rover name, generates an array of valid earth dates
$(".rovers").on("click", function() {
   roverName = $(this).attr("data-rover");
   $(".buttons").empty();

   $.ajax({
      url: "https://api.nasa.gov/mars-photos/api/v1/manifests/" + roverName + "?api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8",
      method: "GET"
   }).then(function(response) {
      var photos = response.photo_manifest.photos;
      
      for(var i = 0; i < photos.length; i++) {
         var mastCam = photos[i].cameras.includes("MAST");
         var panCam = photos[i].cameras.includes("PANCAM");
         if(mastCam === true || panCam === true){
            earthDate = photos[i].earth_date;
            year = moment(earthDate).format("YYYY");
            if(earthDateArr.indexOf(earthDate) === -1){
               earthDateArr.push(earthDate);
            };
            if(yearArr.indexOf(year) === -1){
               yearArr.push(year);
            };
         } else {};
      };
      getYear();            
   });
});
