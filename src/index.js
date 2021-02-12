function formatDate(timestamp) {
  let date = new Date(timestamp);
  let dayIndex = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[dayIndex];

  return `${day} ${formatHours(timestamp)}`;
}

function formatHours (timestamp) {
   let date = new Date(timestamp);
  
   let hours = date.getHours();
      if (hours < 10) {
        hours = `0${hours}`;
    } 

    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = `0${minutes}`;
    } 
    return `${hours}:${minutes}`;

}

let currentTime = new Date();
let h2 = document.querySelector("h2");
h2.innerHTML = formatDate(currentTime);

function showWeather(response) {
  console.log(response);
  document.querySelector("#cities").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].main;

  let iconReference = response.data.weather[0].icon;
  let iconDisplay = document.querySelector("#main-icon");
  iconDisplay.setAttribute("src", `images/${iconReference}.png`);
  iconDisplay.setAttribute("alt", response.data.weather[0].description);

  celsiusTemperature = response.data.main.temp;

}

function displayForecast (response) {
    let forecastDisplay = document.querySelector("#forecast");
    forecastDisplay.innerHTML = null;
    let forecast = null;
   
   
    for (let index = 0; index < 5; index++) {
    forecast = response.data.list[index];
    forecastDisplay.innerHTML += `
     <div class="col">
                    <h3>${formatHours(forecast.dt * 1000)}</h3>
                    <img class="icon-forecast" src="images/${forecast.weather[0].icon}.png">
                    <div class="weather-forecast-temperature">
                            <span class="min">${Math.round(forecast.main.temp_min)}º</span>/<span class="max">${Math.round(forecast.main.temp_max)}º</span>
                        </div>
      </div>
   `;
  }
}


function searchCity(city) {
  let apiKey = "42b6c71393f995c013da06c7d114912a";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(showWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
  
  axios.get(apiUrl).then(displayForecast);

}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#search-text-input").value;
  searchCity(city);
}

function searchLocation(position) {
  let apiKey = "e49f4dac5b0d3a8c77d299a55302727f";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
}

function currentCity(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9/5) + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let celsiusTemperature = null;

let currentLocationButton = document.querySelector("#currentCityButton");
currentLocationButton.addEventListener("click", currentCity);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

searchCity("Barcelona");