// Fire the foundation plugins
$(document).foundation();

// NASA Mars Insight Weather API and functionality
$.ajax({
   url: "https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0&api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8",
   method: "GET"
}).then(function(data) {
   var solKey = data.sol_keys;
   console.log(solKey);
   for(var s = 0; s < solKey.length; s++){
      sol = solKey[s];
      console.log(data[sol]);
      minTempEl = $("<p>").text("Lo: " + data[sol].AT.mn);
      maxTempEl = $("<p>").text("Hi: " + data[sol].AT.mx);
      weatherDate = $("<p>").text(moment(data[sol].Last_UTC).format("MMMM DD, YYYY"));
      solEl = $("<p>").text("Sol " + sol);

      var weatherCell = $("<div>").addClass("cell");
      var weatherCallout = $("<div>").addClass("callout");

      weatherCallout.append(solEl, weatherDate, "<hr>", minTempEl, maxTempEl);
      weatherCell.append(weatherCallout);
      $(".weather-div").append(weatherCell);
   }
});

// NASA Rover Picture Query Functionality
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
