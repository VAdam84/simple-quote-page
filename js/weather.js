let selectedCity = document.querySelector(".city-select").value;
let urlWeatherDataByCity = `http://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=metric&APPID=01d209c46237e2263c0c0bca6b0b317b`;
let urlFiveDaysForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&appid=01d209c46237e2263c0c0bca6b0b317b`;
let weatherDataByCity = {};
let weatherForecast = {};
let container = document.querySelector('.container');
let maxTemps = document.querySelectorAll(".max-temperature");
let minTemps = document.querySelectorAll(".min-temperature");
let dates = document.querySelectorAll(".day-box .date");
let days = document.querySelectorAll(".day-box .day");
let icons = document.querySelectorAll(".icon img");
let dayIcons = document.querySelectorAll(".day-icon img");
let temperatures = document.querySelectorAll('.temperature');
let timesOfDay = document.querySelectorAll('.time-of-day');
let map;
let marker;
let cityData = {};
let weatherConditions = {
    "01d": "icons/day_clear.svg",
    "01n": "icons/night_full_moon_clear.svg",
    "02d": "icons/day_partial_cloud.svg",
    "02n": "icons/night_full_moon_partial_cloud.svg",
    "03d": "icons/cloudy.svg",
    "03n": "icons/night_full_moon_partial_cloud.svg",
    "04d": "icons/angry_clouds.svg",
    "04n": "icons/angry_clouds.svg",
    "09d": "icons/day_rain.svg",
    "09n": "icons/night_full_moon_rain.svg",
    "10d": "icons/day_rain.svg",
    "10n": "icons/night_full_moon_rain.svg",
    "11d": "icons/day_rain_thunder.svg",
    "11n": "icons/night_full_moon_rain_thunder.svg",
    "13d": "icons/day_snow.svg",
    "13n": "icons/night_half_moon_snow.svg",
    "50d": "icons/fog.svg",
    "50n": "icons/fog.svg"
}

//oldal betöltődésekor kéri le az időjárás adatot a szerverről
function fetchCityData(url) {
    fetch(url).then(data=>{return data.json()})
                .then(data=>{ 
                    console.log(data);
                  return weatherDataByCity = data;
                });

}
fetchCityData(urlWeatherDataByCity);

//dátumok inicializálása
function initDates() {
    let now = new Date();
    for(let date of dates) {
        date.innerHTML = now.getDate();
        now.setDate(now.getDate()+1);
        now = new Date(now);
    }
}
//napok inicializálása
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
//maximum, minimum hőmérsékletek inicializálása
function initMaxAndMinTemps() {
    for(let minTemp of minTemps) {
        minTemp.innerHTML = `${Math.ceil(weatherDataByCity.main.temp_min)}°`;
    }
    for(let maxTemp of maxTemps) {
        maxTemp.innerHTML = `${Math.floor(weatherDataByCity.main.temp_max)}°`;
    }
}
function fetchforecast(url) {
    fetch(url).then(data=>{return data.json()})
            .then(data=>{ 
              return weatherForecast = data.list;
            });
}

function iconsInit() {
    for(let i = 0; i<6; i++) {
        let iconText=weatherForecast[i].weather[0].icon;
        let time = new Date(weatherForecast[i].dt_txt).getHours();
        icons[i].src = weatherConditions[iconText];
        temperatures[i].innerHTML = `${Math.floor(weatherForecast[i].main.temp)}C°`;
        timesOfDay[i].innerHTML = `${time}:00`;
    }
}

function dayIconsInit() {
    let dayIconsPerDay = new Map();
    for(let i=0; i<weatherForecast.length; i++) {
        let day = new Date(weatherForecast[i].dt_txt).getDate();
        if(dayIconsPerDay.has(day)) {
            dayIconsPerDay.get(day).push(weatherForecast[i].weather[0].icon);
        } else {
            dayIconsPerDay.set(day,[]);
        }

    }
    let icons = [];
    for(let icon of dayIconsPerDay.values()) {
        icons.push(icon[0]);
    }
    for(let i=0; i<dayIcons.length; i++) {
        dayIcons[i].src = weatherConditions[icons[i]]; 
    }
}

function changeMaxMin() {
    let minTempsByDay = new Map();
    let maxTempsByDay = new Map();
    for(let i=0; i<weatherForecast.length; i++) {
        let day = new Date(weatherForecast[i].dt_txt).getDate();
        if(minTempsByDay.has(day)) {
            minTempsByDay.get(day).push(weatherForecast[i].main.temp_min);
            maxTempsByDay.get(day).push(weatherForecast[i].main.temp_max);
        } else {
            minTempsByDay.set(day,[]);
            maxTempsByDay.set(day,[]);
        }

    }
    let mintemps = [];
    let maxtemps = [];
    for(let min of minTempsByDay.values()) {
        mintemps.push(Math.floor(Math.min(...min)));
    }
    for(let max of maxTempsByDay.values()) {
        maxtemps.push(Math.floor(Math.max(...max)));
    }
    for(let i=0; i<mintemps.length; i++) {
        minTemps[i].innerHTML = `${mintemps[i]}°`;
        maxTemps[i].innerHTML = `${maxtemps[i]}°`;
    }
    
}
function initMap(lat,lng) {
    map = new google.maps.Map(document.querySelector('#map'), {
        center: new google.maps.LatLng(lat, lng),
        zoom: 11
    });
    marker = new google.maps.Marker({
        position: {lat:lat, lng:lng},
        map: map
    });
}
function setMapCenter(lat,lng) {
    map.setCenter(new google.maps.LatLng(lat,lng));
    marker = new google.maps.Marker({
        position: {lat:lat, lng:lng},
        map: map
    });
}
function changeBackground() {
    let now = new Date();
    if(now.getHours() <=8 ){
        container.style.backgroundImage = 'url(../images/dawn.jpg)';
    } else if(now.getHours() < 19 ) {
        container.style.backgroundImage = 'url(../images/clouds.jpg)';
    } else {
        container.style.backgroundImage = 'url(../images/night.jpg)';
    }
}

$(document).ready(()=>{
    changeBackground();
    initDates();
    initDays();
    fetchforecast(urlFiveDaysForecast);
    setTimeout(() => {
        initMaxAndMinTemps();
        iconsInit();
        initMap(weatherDataByCity.coord.lat,weatherDataByCity.coord.lon);
        dayIconsInit();
    }, 700);
    //városok kiválasztásánál figyeli a változást és lekéri a városnak megfelelő adatot a szerverről
    $(".city-select").change((e)=>{
        selectedCity = e.target.value; 
        let url = "http://api.openweathermap.org/data/2.5/weather?q="+selectedCity+"&units=metric&APPID=01d209c46237e2263c0c0bca6b0b317b";
        let urlforecast = "https://api.openweathermap.org/data/2.5/forecast?q="+selectedCity+"&units=metric&appid=01d209c46237e2263c0c0bca6b0b317b";
        fetchCityData(url);
        fetchforecast(urlforecast);
        setTimeout(() => {
            setMapCenter(weatherDataByCity.coord.lat,weatherDataByCity.coord.lon);
            iconsInit();
            changeMaxMin();
        }, 700);
        setTimeout(() => {
            dayIconsInit();
        }, 700);
    });
});
