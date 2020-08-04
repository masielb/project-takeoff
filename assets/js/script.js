// NASA Insight API 
var weatherURL = "https://api.nasa.gov/insight_weather/?api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8&feedtype=json&ver=1.0"

$.ajax({
   url: "https://api.nasa.gov/insight_weather/?api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8&feedtype=json&ver=1.0",
   method: "GET"
}).then(function(response) {
   console.log(response);
   
});

var photoDate = ""
var roverName = ""

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

$("button").on("click", function() {
   roverName = $(this).attr("data-rover");
   console.log(roverName);

   // Rover Manifest
   $.ajax({
      url: "https://api.nasa.gov/mars-photos/api/v1/manifests/" + roverName + "?api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8",
      method: "GET"
   }).then(function(response) {
      // console.log(response);
      var photos = response.photo_manifest.photos;
      console.log(photos);
      for(var i = 0; i < photos.length; i++) {
         var mastCam = photos[i].cameras.includes("MAST");
         var panCam = photos[i].cameras.includes("PANCAM");
         if(mastCam === true || panCam === true){
            var earthDate = photos[i].earth_date;
            var dateBtn = $("<button>");
            dateBtn.attr("data-date", earthDate).text(earthDate).addClass("earth-date");
            $(".photo-buttons").append(dateBtn);
         } else {};
      };
      $(".earth-date").on("click", function() {
         photoDate = $(this).attr("data-date");
         displayPhotos();
      });
   });
});

