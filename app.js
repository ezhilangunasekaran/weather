var myapp = angular.module('myApp', ['ngMaterial','ngMessages', 'material.svgAssetsCache']);

myapp.controller('openWeather', function($scope, $http) {
  $scope.entercity= 'newyork'; // default
  $scope.defaultweather=function(){
  $http.get("http://api.openweathermap.org/data/2.5/forecast/daily?q="+ $scope.entercity +"&mode=json&units=imperial&cnt=7&appid=67db47f8da0d01a93ed2fbf65843089d")
  .then(function(response) {
      $scope.myWeather = response.data;
      var listarr = $scope.myWeather.list;
      var nuday =[];
      var nudate =[];
      var numonth =[];
      var iconurl = [];

      for(i=0;i<listarr.length;i++){
       nuday.push(findDay(new Date(listarr[i].dt*1000))); 
       nudate.push(findDate(new Date(listarr[i].dt*1000))); 
       numonth.push(findMonth(new Date(listarr[i].dt*1000))); 
       iconurl.push("http://openweathermap.org/img/w/"+listarr[i].weather[0].icon+".png");
      }  
      $scope.Day = nuday;
      $scope.Date = nudate;
      $scope.Month = numonth;
      $scope.icon = iconurl;
  });
  };

angular.element(document).ready(function(){
    $scope.defaultweather();
});
  $scope.city = function(){
    $scope.entercity = $scope.citval;
    $scope.defaultweather();
  };
  
});


function findDay(weather_date) {
    var d = new Date(weather_date);
    var weekday = [];
    weekday = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    return weekday[d.getDay()];
}

function findMonth(weather_date) {
    var d = new Date(weather_date);
    var monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
return monthNames[d.getMonth()];
}
function findDate(weather_date){
  var d = new Date(weather_date);
  return d.getDate();
}


//for snow

window.onload = function(){
  //canvas init
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  
  //canvas dimensions
  var W = window.innerWidth;
  var H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;
  
  //snowflake particles
  var mp = 25; //max particles
  var particles = [];
  for(var i = 0; i < mp; i++)
  {
    particles.push({
      x: Math.random()*W, //x-coordinate
      y: Math.random()*H, //y-coordinate
      r: Math.random()*4+1, //radius
      d: Math.random()*mp //density
    })
  }
  
  //Lets draw the flakes
  function draw()
  {
    ctx.clearRect(0, 0, W, H);
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    for(var i = 0; i < mp; i++)
    {
      var p = particles[i];
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
    }
    ctx.fill();
    update();
  }
  
  //Function to move the snowflakes
  //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
  var angle = 0;
  function update()
  {
    angle += 0.01;
    for(var i = 0; i < mp; i++)
    {
      var p = particles[i];
      //Updating X and Y coordinates
      //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
      //Every particle has its own density which can be used to make the downward movement different for each flake
      //Lets make it more random by adding in the radius
      p.y += Math.cos(angle+p.d) + 1 + p.r/2;
      p.x += Math.sin(angle) * 2;
      
      //Sending flakes back from the top when it exits
      //Lets make it a bit more organic and let flakes enter from the left and right also.
      if(p.x > W+5 || p.x < -5 || p.y > H)
      {
        if(i%3 > 0) //66.67% of the flakes
        {
          particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
        }
        else
        {
          //If the flake is exitting from the right
          if(Math.sin(angle) > 0)
          {
            //Enter from the left
            particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
          }
          else
          {
            //Enter from the right
            particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
    }
    }
  }
}
}
//animation loop
setInterval(draw,33);
}