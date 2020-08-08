// Fire the foundation plugins and hide containers
$(document).foundation();
$("#explore-date").hide();
$(".rover-pics").hide();

// NASA Mars Insight Weather API call and dynamic HTML elements
$.ajax({
   url: "https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0&api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8",
   method: "GET"
}).then(function(data) {
   var solKey = data.sol_keys;
   console.log(solKey);
   for(var s = 0; s < solKey.length; s++){
      sol = solKey[s];
      console.log(data[sol]);
      minTempEl = $("<p>").text("Lo: " + data[sol].AT.mn.toFixed(1) + " °C");
      maxTempEl = $("<p>").text("Hi: " + data[sol].AT.mx.toFixed(1) + " °C");
      weatherDate = $("<p>").text(moment(data[sol].Last_UTC).format("MMMM DD, YYYY"));
      solEl = $("<p>").text("Sol " + sol);

      var weatherCell = $("<div>").addClass("cell");
      var weatherCallout = $("<div>").addClass("callout");

      weatherCallout.append(solEl, weatherDate, "<hr>", minTempEl, maxTempEl);
      weatherCell.append(weatherCallout);
      $(".weather-div").append(weatherCell);
   }
});

// NASA Rover Picture Query Functionality Global Variables
var year = "";
var month = "";
var day = "";
var photoDate = "";
var roverName = "";
var earthDateArr = [];
var yearArr = [];
var monthArr = [];
var dayArr = [];
var imgObj= [];
var imgArr = [];

// Display only valid years for the chosen rover
function getYear() {
   $(".buttons").empty();
   for(var k = 0; k < yearArr.length; k++) {
      var yearBtn = $("<button>").addClass("columns medium-6 years").attr("data-year", yearArr[k]).text(yearArr[k]);
      $(".buttons").append(yearBtn);
   };
   
   $(".years").on("click", function() {
   year = $(this).attr("data-year");
   getMonth();
   });
};

// Display only valid months for the chosen year
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

// Display only valid days for the chosen year and month
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

// User confirms the date they have chosen
function confirmDate() {
   $(".buttons").empty();
   photoDate = year + "-" + month + "-" + day
   var confirmBtn = $("<button>").addClass("confirm").text(moment(photoDate).format("MMMM DD, YYYY"));
   var cancelBtn = $("<button>").addClass("re-do").text("Re-do");
   var confirmEl = $("<h3>").text("Please confirm your search date:");
   $(".buttons").append(confirmEl, confirmBtn, cancelBtn);

   $(".confirm").on("click", function() {
      getPhotos();
   });
   $(".re-do").on("click", function() {
      location.reload(true);
   });
   
   console.log("Your date is:" + photoDate);
};

// NASA Rover Photos API Call
function getPhotos() {
   $.ajax({
      url: "https://api.nasa.gov/mars-photos/api/v1/rovers/" + roverName + "/photos?earth_date=" + photoDate + "&api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8",
      method: "GET"
   }).then(function(response) {
      var pics = response.photos
      for(var j = 0; j < pics.length; j++) {
         var mastCam = pics[j].camera.name.includes("MAST");
         var panCam = pics[j].camera.name.includes("PANCAM");
         if(mastCam === true || panCam === true){
            var imgSrc = response.photos[j].img_src
            // var imgEl = $("<img>").attr("src", imgSrc);
            // $(".rover-images").append(imgEl);
         };
         imgObj.push({imgSrc});
      };
      sortPhotos();
      // $(".rover-pics").show();
   });
};

// Sort through the valid photos and make sure the source link is not undefined
function sortPhotos() {
   for(var q = 0; q < imgObj.length; q++){
      if(imgObj[q].imgSrc !== undefined){
         imgArr.push(imgObj[q].imgSrc);
      };
   };
   displayPhotos();
};

// Display up to 6 photos from the image array
function displayPhotos() {
   for(var r = 0; r < 6; r++){
      $(".buttons").empty();
      var imgDiv = $("<div>").addClass("columns small-12 medium-4 large-3");
      var imgEl = $("<img>").attr({src:imgArr[r], alt:"A photo from Mars"}).addClass("thumbnail");

      imgDiv.append(imgEl);
      $(".rover-grid").append(imgDiv);
   };
};

// When user clicks a rover name, generates an array of valid earth dates for that rover
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

// fade in for landing page
$("#bg").animate({
   opacity: 1,
 }, 2000, function() {

 });

 //smooth transition from landing to explore
 $(".test").on("click", function () {
   $("#bg").animate({
     opacity: 0,
   }, 1000, function() {
     window.location.href = "./explore.html";
   })

   
 });