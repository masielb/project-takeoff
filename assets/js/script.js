// Fire the foundation plugins
$(document).foundation();

// NASA Insight API 
var weatherURL = "https://api.nasa.gov/insight_weather/?api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8&feedtype=json&ver=1.0"

$.ajax({
   url: "https://api.nasa.gov/insight_weather/?api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8&feedtype=json&ver=1.0",
   method: "GET"
}).then(function(response) {
   console.log(response);
   
});

var earthDateArr = [];
var photoDate = "";
var roverName = "";
var yearArr = [];
var monthArr = [];

function getYear() {
   $(".buttons").empty();
   for(var k = 0; k < yearArr.length; k++) {
      var yearBtn = $("<button>").addClass("years").attr("data-year", yearArr[k]).text(yearArr[k]);
      $(".buttons").append(yearBtn);
   }
}

function getMonth() {
   $(".buttons").empty();
   
}

// NASA Rover Photos
function displayPhotos() {
   $.ajax({
      url: "https://api.nasa.gov/mars-photos/api/v1/rovers/" + roverName + "/photos?earth_date=" + photoDate + "&api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8",
      method: "GET"
   }).then(function(response) {
      console.log(response);
      console.log(photoDate);
      console.log(roverName);
      $(".photo-buttons").empty();
      var pics = response.photos
      for(var j = 0; j < pics.length; j++) {
         var mastCam = pics[j].camera.name.includes("MAST");
         console.log(mastCam);
         var panCam = pics[j].camera.name.includes("PANCAM");
         if(mastCam === true || panCam === true){
            var imgSrc = response.photos[j].img_src
            console.log(imgSrc);
            var imgEl = $("<img>").attr("src", imgSrc);
            $(".photo-buttons").append(imgEl);
         };
      };
   });
};

// When user clicks a rover, generates an array of valid earth dates
$(".rovers").on("click", function() {
   roverName = $(this).attr("data-rover");

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
            year = moment(earthDate).format("YYYY")
            if(earthDateArr.indexOf(earthDate) === -1){
               earthDateArr.push(earthDate);
            }
            if(yearArr.indexOf(year) === -1){
               yearArr.push(year);
            }
         } else {};
      };
      getYear();            
   });
});

$(".years").on("click", function() {
   year = $(this).attr("data-year");

})

