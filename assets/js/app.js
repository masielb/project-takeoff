$(document).foundation()

$(document).ready(function () {
  $.ajax({
    type: "GET",
    
    url: "https://api.nasa.gov/insight_weather/?api_key=pFKdFVGvwbWahVX3Bc0avh75Y9das6qephDzkJIU&feedtype=json&ver=1.0",
    success: function (response) {
      
      
    }
  });
});
