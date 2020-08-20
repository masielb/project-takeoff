// Fire the foundation plugins and hide containers
$(document).foundation();
$("#explore-date").hide();
$("#explore-user").hide();

// NASA Mars Insight Weather API call and dynamic HTML elements
$.ajax({
   url: "https://api.nasa.gov/insight_weather/?feedtype=json&ver=1.0&api_key=Bjd4d9v5oIk2XvFo5LoqMnNbD8FLmddlFrXHu4k8",
   method: "GET"
}).then(function(data) {
   var solKey = data.sol_keys;
   for(var s = 0; s < solKey.length; s++){
      sol = solKey[s];
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

// User ticket experience global variables
var user = [];

function takeOff() {
   var userName = $("#username").val();
   var launchDate = $("#start").val();

   user.push(userName);
   user.push(launchDate);
   localStorage.setItem("mars-user", JSON.stringify(user));
   location.href="takeoff.html";

}

var storedUser = JSON.parse(localStorage.getItem("mars-user"));

if(storedUser !== null){
   $("#ticket-header").text("Mars Ticket for: " + storedUser[0]);
   $("#ticket-number").text("Confirmation #: 1312-YM1W-1Q33");
   $("#ticket-text").text("Your Mission to Mars launches on: " + moment(storedUser[1]).format("MMMM DD, YYYY"));
};


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
var userGallery = [];
var explainHead = "";
var explainBody = "";
var explainHeadEl = $("#explain-header")
var explainBodyEl = $("#explain-body")
var cancelBtn = $("<button>").addClass("re-do").text("Start Over");

// Store user gallery in local storage
function saveUserPhotos() {
   var jsonGallery = [];
   for(var g = 0; g < userGallery.length; g++){
      var image =  userGallery[g].currentSrc
      jsonGallery.push(image);
   }
   localStorage.setItem("userGallery", JSON.stringify(jsonGallery));

   explainHead = "Ready For Launch!"
   explainBody = "Choose your launch date and enter your name to generate a ticket:"
   explainHeadEl.text(explainHead);
   explainBodyEl.text(explainBody);
   $(".buttons").empty();
   $("#gallery").empty();

   $("#explore-date").show();
   $("#explore-user").show();

   var submitBtn = $("<button>").addClass("submit").text("Take Off!");
   $(".buttons").append(submitBtn);
   $(".submit").on("click", function() {
      takeOff();
   });

};

// Display only valid years for the chosen rover
function getYear() {
   explainHead = "Step One"
   explainBody = "Choose which Earth year you'd like to view:"
   explainHeadEl.text(explainHead);
   explainBodyEl.text(explainBody);
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
   explainHead = "Step Two"
   explainBody = "In "+ year + ", " + roverName +" sent us photos in the following months. Choose a month from the option below:"
   explainHeadEl.text(explainHead);
   explainBodyEl.text(explainBody);
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
   explainHead = "Step Three"
   explainBody = "In " + moment(month, "MM").format("MMMM") +  " of  " + year +", " + roverName + " sent us photos on the following days; choose one:" 
   explainHeadEl.text(explainHead);
   explainBodyEl.text(explainBody);

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
   explainHead = "Confirm Your Search Date"
   explainBody = "Click the date below to display a view of Mars through the eyes of " + roverName +". Keep in mind, the rovers occasionally cast their gaze heavenward, so if you're not happy with the selection, simply start over and choose a different date."
   explainHeadEl.text(explainHead);
   explainBodyEl.text(explainBody);
   $(".buttons").empty();
   
   photoDate = year + "-" + month + "-" + day
   var confirmBtn = $("<button>").addClass("confirm").text(moment(photoDate).format("MMMM DD, YYYY"));
   $(".buttons").append(confirmBtn, cancelBtn);


   $(".confirm").on("click", function() {
      getPhotos();
   });
   $(".re-do").on("click", function() {
      location.reload(true);
   });
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
         };
         imgObj.push({imgSrc});
      };
      sortPhotos();
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
      var imgEl = $("<img>").attr({src:imgArr[r], alt:"A photo from Mars", id:"photo-"+[r]}).addClass("thumbnail");
      var resetBtn = $("<button>").attr("id", "reset").text("Reset Selection");
      var reloadBtn = $("<button>").addClass("re-do").text("Start Over");

      var galCreate = $("<button>").attr("id", "create").text("Create Gallery");
      imgDiv.append(imgEl);
      $("#gallery").append(imgDiv);
   };
   $(".buttons").append(reloadBtn, galCreate, resetBtn);
   $(".re-do").on("click", function(){
      location.reload(true);
   })
   buildGallery();
};

// Whent the gallery is built, user selects up to 4 photos for their own personal gallery
function buildGallery () {
   explainHead = "Build Your Backyard View"
   explainBody = "Choose up to Four(4) beautiful Martian vistas to display on the viewscreens inside your Martian home. If you aren't happy with the selections you can always start over."
   explainHeadEl.text(explainHead);
   explainBodyEl.text(explainBody);
   $(".thumbnail").on("click", function () {
       $(this).toggleClass("selected");
   });
   $("#reset").on("click", function () {
       $("img.selected").removeClass("selected");
   });
   $("#create").on("click", function () {
      if ($("img.selected").length === 0 || $("img.selected").length > 4 ) {
         $("#create").attr("data-open", "errormodal");

      } else {
         $("#create").removeAttr("data-open", "errormodal");
         displayGallery();

      };  
   });
};

function displayGallery() {
   $(".buttons").empty();
   $("img").off("click");
   $("img:not(.selected)").remove();
   $("img.selected").removeClass("selected");

   var userImage = $(".thumbnail");
   for (var s = 0; s < userImage.length; s++){
      userGallery.push(userImage[s]);
   }
   console.log(userGallery)
   $("#gallery").empty();


   explainHead = "You're almost there!"
   explainBody = "If you are ready to save your Backyard View, click the SAVE Button, otherwise click Start Ove."
   explainBodyEl.text(explainBody);
   explainHeadEl.text(explainHead);
   var saveBtn = $("<button>").addClass("save").text("SAVE");
   for(var t = 0; t < userGallery.length; t++){
      var imgDiv = $("<div>").addClass("columns small-12 medium-4 large-3");
      var userImgEl = userGallery[t];
      imgDiv.append(userImgEl);
      $("#gallery").append(imgDiv);
   };
   $(".buttons").append(saveBtn, cancelBtn);
   $(".re-do").on("click", function() {
      location.reload(true);
   });
   $(".save").on("click", function () {
      saveUserPhotos();
   });
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

// fade in for landing and explore page
$("#bg").animate({
   opacity: 1,
 }, 2000, function() {

 });

 //smooth transition to explore pages
 $(".explore").on("click", function () {
   $("#bg").animate({
     opacity: 0,
   }, 1000, function() {
     window.location.href = "./explore.html";
   })
 });

 $(".plan").on("click", function () {
   $("#bg").animate({
     opacity: 0,
   }, 1000, function() {
     window.location.href = "./index.html";
   })
 });

 $(".takeoff").on("click", function () {
   $("#bg").animate({
     opacity: 0,
   }, 1000, function() {
     window.location.href = "./takeoff.html";
   })
 });
 
 