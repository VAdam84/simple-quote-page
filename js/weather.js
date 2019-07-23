let url = "http://api.openweathermap.org/data/2.5/weather?q=Hatvan&units=metric&APPID=01d209c46237e2263c0c0bca6b0b317b";
let urlfor = "https://api.openweathermap.org/data/2.5/forecast?q=Hatvan&units=metric&appid=01d209c46237e2263c0c0bca6b0b317b";
let urlmap = "https://tile.openweathermap.org/map/temp_new/3/4/4.png?appid=01d209c46237e2263c0c0bca6b0b317b"
let result;
let maxTemp = document.querySelector(".max-temperature");
let minTemp = document.querySelector(".min-temperature");

$( document ).ready(function() {
    $.get(url,(data)=>{
        result = data;
        maxTemp.innerHTML = result.main.temp_max;
        minTemp.innerHTML = result.main.temp_min;
        console.log(result);
    });
    $.get(urlfor,(data)=>{console.log(data)});
    $.get(urlmap,(data)=>{console.log(data)});
});