$(document).ready(function () {
  //var bg = document.body.style.backgroundImage = document.body.style.backgroundImage;

  $("#bg").animate({
    opacity: 1,
  }, 2000, function() {

  });

  $(".test").on("click", function () {
    $("#bg").animate({
      opacity: 0,
    }, 1000, function() {
      window.location.href = "./explore.html";
    })

    
  });
});