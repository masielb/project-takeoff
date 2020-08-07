$(document).ready(function () {
  //var bg = document.body.style.backgroundImage = document.body.style.backgroundImage;

  $(".test").on("click", function () {
    $("#bg").animate({
      opacity: 0,
    }, 2000, function() {
      window.location.href = "./explore.html";
    })

    
  });
});