
const form = document.getElementById('form');
const city = document.getElementById('city-name');
const cityMessage = document.querySelector('.city-message');

// weather icons 
const weatherIcons = {
   Clear: "Weather Icons/Icons type 2/sun.png",
   Clouds: "Weather Icons/Icons type 2/sun-cloud.png",
   Rain: "Weather Icons/Icons type 2/rain.png",
   Snow: "Weather Icons/Icons type 2/snow-cloud.png",
   Smoke: "Weather Icons/Icons type 2/cloud.png",
   Haze: "Weather Icons/Icons type 2/haze2.webp",
}

// getting data from weather api 
const weatherData = async (city) => {
    let api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1abdea4113c7cab622904265993f9bdc`;
    try{
        let res = await fetch(api);
        let data = await res.json();
        fetchWeatherData(data);
        console.log(data);
        cityMessage.style.display = 'none'
    }catch(error){
        cityMessage.style.display = 'block'
    }
}

// funtion to get the country name by its country code which is provided by the api 
const getCountryName = (countryCode) => {
    return new Intl.DisplayNames([countryCode], { type: 'region' }).of(countryCode);
}

// funtion to get date and time format of that country. converting seconds (given by api) into date and time format 
const getDateTime = (dateTime) => {
    const currentDate = new Date(dateTime * 1000);

    const options = {
        weedays: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }
    return new Intl.DateTimeFormat('en-US', options).format(currentDate)
}

// funtion which display status of wind, humidity, feels like, pressure and visibility 
const displayStatus = (mainElement, icon, status) => {
    mainElement.nextElementSibling.innerHTML = `<i class="fa-solid ${icon}"></i><span class="ms-2 description">${status}</span>`;
}

// function to fetch the recieved data on the web page
const fetchWeatherData = (data) => {
    const {main, dt, name, sys, visibility, weather, wind} = data  // destructuring data object

    const weatherIcon = document.getElementById('weather-icon');
    const weatherType = document.getElementById('weather-type');
    const dateTime = document.getElementById('date-time');
    const temperature = document.getElementById('temp');
    const location = document.getElementById('location');
    const windSpeed = document.getElementById('wind-speed');
    const feelsLike = document.getElementById('feels-like');
    const humidity = document.getElementById('humidity');
    const Visibility = document.getElementById('visibility');
    const pressure = document.getElementById('pressure');

    // calculations 
    let windSpeedCalculation = (wind.speed * 3.6).toFixed(1);
    let tempCalculation = Math.round(main.temp - 273.15);
    let feelsLikeCalculation = Math.round(main.feels_like - 273.15);
    let visibilityCalculation = visibility / 1000;

    // fetching data start
    if(weatherIcons.hasOwnProperty(weather[0].main)) {
        weatherIcon.src = weatherIcons[weather[0].main];
        weatherIcon.alt = `${weatherIcons[weather[0].main]} Icon`;
    }

    weatherType.innerText = weather[0].main;
    location.innerText = `${name}, ${getCountryName(sys.country)}`;
    dateTime.innerText = getDateTime(dt);
    temperature.innerHTML = `${tempCalculation}<sup  class="sub-string" style='font-size: 2.5rem'>&deg;C</sup>`;
    windSpeed.innerHTML = `${windSpeedCalculation} <span class="sub-string" style='font-size: .8rem'>km/h</span>`;

    // statements for wind status to show the apropriate status 
    if(Math.round(windSpeedCalculation) < 6) displayStatus(windSpeed, "fa-wind", "Calm");
    else if(Math.round(windSpeedCalculation) >= 6 && Math.round(windSpeedCalculation) <= 20) displayStatus(windSpeed, "fa-wind", "Light Breeze");
    else if(Math.round(windSpeedCalculation) > 21 && Math.round(windSpeedCalculation) <= 39) displayStatus(windSpeed, "fa-wind", "Moderate Breeze");
    else if(Math.round(windSpeedCalculation) > 39)displayStatus(windSpeed, "fa-wind", "Strong Wind");

    feelsLike.innerHTML = `${feelsLikeCalculation}<sup  class="sub-string" style='font-size: 1.5rem'>&deg;C</sup>`;
    
    // statements for feels like to show the apropriate status 
    if(feelsLikeCalculation < -10) displayStatus(feelsLike, "fa-temperature-three-quarters", "Very Cold");
    else if(feelsLikeCalculation >= -10 && feelsLikeCalculation <= 0) displayStatus(feelsLike, "fa-temperature-three-quarters", "Cold");
    else if(feelsLikeCalculation > 0 && feelsLikeCalculation <= 10) displayStatus(feelsLike, "fa-temperature-three-quarters", "Cool");
    else if(feelsLikeCalculation > 10 && feelsLikeCalculation <= 20) displayStatus(feelsLike, "fa-temperature-three-quarters", "Mild");
    else if(feelsLikeCalculation > 20 && feelsLikeCalculation <= 30) displayStatus(feelsLike, "fa-temperature-three-quarters", "Warm");
    else if(feelsLikeCalculation > 30) displayStatus(feelsLike, "fa-temperature-three-quarters", "Hot");

    humidity.innerHTML = `${main.humidity}<span class="sub-string ms-1" style='font-size: .8rem'>%</span>`;

    // statements for humidity to show the apropriate status 
    if(main.humidity < 40) displayStatus(humidity, "fa-droplet", "Dry");
    else if(main.humidity >= 40 && main.humidity <= 60) displayStatus(humidity, "fa-droplet", "Comfortable");
    else if(main.humidity > 60) displayStatus(humidity, "fa-droplet", "Humid");

    Visibility.innerHTML = `${visibilityCalculation }${(visibilityCalculation > 10) ? `<span style='font-size: .9rem'>+</span>`: ``} <span class="sub-string" style='font-size: .8rem'>km</span>`;

    // statements for visibility to show the apropriate status 
    if(visibilityCalculation > 10) displayStatus(Visibility, "fa-smog", "Excellent");
    else if(visibilityCalculation >= 5 && visibilityCalculation <= 10) displayStatus(Visibility, "fa-smog", "Good");
    else if(visibilityCalculation >= 1 && visibilityCalculation < 5) displayStatus(Visibility, "fa-smog", "Fair");
    else if(visibilityCalculation < 1) displayStatus(Visibility, "fa-smog", "Poor");

    pressure.innerHTML = `${main.pressure} <span class="sub-string" style='font-size: .8rem'>mb</span>`;

    // statements for pressure to show the apropriate status 
    if(main.pressure < 1000) displayStatus(pressure, "fa-gauge-high", "Low");
    else if(main.pressure >= 1000 && main.pressure < 1013) displayStatus(pressure, "fa-gauge-high", "Normal");
    else if(main.pressure > 1013) displayStatus(pressure, "fa-gauge-high", "High");
        
    // fetching data ends 
}

// adding event listener on search field to fetch weather data of entered city name when user pressed Enter button 
city.addEventListener('keypress' ,(event) => {
   if (event.key === 'Enter') weatherData(city.value); 
})

// adding event listener on search field to fetch weather data of entered city name when user clicked on search button 
form.addEventListener('submit', (event) => {
    event.preventDefault();
    weatherData(city.value);
})

// fetching weather details of default city name on first DOM load 
window.addEventListener('DOMContentLoaded', () => {
    weatherData(city.value);
})


    