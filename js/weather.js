let selectedCity = document.querySelector(".city-select").value;
let url = "http://api.openweathermap.org/data/2.5/weather?q="+selectedCity+"&units=metric&APPID=01d209c46237e2263c0c0bca6b0b317b";
let urlfor = "https://api.openweathermap.org/data/2.5/forecast?q="+selectedCity+"&units=metric&appid=01d209c46237e2263c0c0bca6b0b317b";
let urlmap = "https://tile.openweathermap.org/map/temp_new/3/4/4.png?appid=01d209c46237e2263c0c0bca6b0b317b"
let result = {};
let resultFor = {};
let maxTemps = document.querySelectorAll(".max-temperature");
let minTemps = document.querySelectorAll(".min-temperature");
let dates = document.querySelectorAll(".day-box .date");
let days = document.querySelectorAll(".day-box .day");


fetch(url).then(data=>{return data.json()})
          .then(data=>{ return result = data;});


function initDates() {
    let now = new Date();
    for(let date of dates) {
        date.innerHTML = now.getDate();
        now.setDate(now.getDate()+1);
        now = new Date(now);
    }
}
function initDays() {
    let now = new Date();
    let weekDays = {
        0:"Sun",
        1:"Mon",
        2:"Tue",
        3:"Wed",
        4:"Thu",
        5:"Fri",
        6:"Sat"
    }
    for(let day of days) {
        day.innerHTML = weekDays[now.getDay()];
        now.setDate(now.getDate()+1);
        now = new Date(now);
    }
}
function initMaxAndMinTemps() {
    for(let minTemp of minTemps) {
        minTemp.innerHTML = Math.ceil(result.main.temp_min);
    }
    for(let maxTemp of maxTemps) {
        maxTemp.innerHTML = Math.floor(result.main.temp_max);
    }
}

$(document).ready(()=>{
    console.log(selectedCity);
    initDates();
    initDays();
    setTimeout(() => {
        initMaxAndMinTemps();
    }, 1000);
    $(".city-select").change((e)=>{
        selectedCity = e.target.value; 
        let url = "http://api.openweathermap.org/data/2.5/weather?q="+selectedCity+"&units=metric&APPID=01d209c46237e2263c0c0bca6b0b317b";

        fetch(url).then(data=>{return data.json()})
          .then(data=>{ return result = data;}); 
        console.log(selectedCity);
        setTimeout(() => {
            console.log(result);
            initMaxAndMinTemps();

        }, 500);
    });
});
