const key = "a83f619db0bf9e35a21b85c461d75e1d";

const url = "https://api.openweathermap.org/data/2.5/weather";
const degree = document.querySelector("#degree");
const currentLocation = document.querySelector("#current-location");
const mainIcon = document.querySelector("#main-icon");
const weatherDescription = document.querySelector("#weather-title");
const celsiusLink = document.querySelector("#celsius-link");
const fahrenheitLink = document.querySelector("#fahrenheit-link");
let celsiusTemperature = null;
const maxTemperature = document.querySelector("#max-temp");
const minTemperature = document.querySelector("#min-temp");
const feelsTemperature = document.querySelector("#feels-temp");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
document.body.onload = handleCurrentLocation;

const weekForecast = document.querySelector("#week-forecast");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function handleCurrentLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    sendLocationRequest(position.coords.latitude, position.coords.longitude);
  });
}

currentLocation.addEventListener("click", handleCurrentLocation);

function getForecast(location) {
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lon}&appid=${key}&units=metric`;
  axios
    .get(apiURL)
    .then(createWeekForecast)
}

function sendLocationRequest(latitude, longitude) {
  axios
    .get(`${url}?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`)
    .then(function (response) {
      changeTitleCity(response.data.name);
      changeDegree(response);
      changeMainIcon(response);
      changeDegree(response);
      updateWeatherDetails(response);
      celsiusTemperature = Math.floor(response.data.main.temp);
      return response;
    });
}

function sendRequest(city) {
  axios
    .get(`${url}?q=${city}&appid=${key}&units=metric`)
    .then(function (response) {
      console.log(response);
      changeDegree(response);
      changeMainIcon(response);
      changeWeatherDescription(response);
      updateWeatherDetails(response);
      celsiusTemperature = Math.floor(response.data.main.temp);
      getForecast(response.data.coord);
      return response;
    });
}

function changeMainIcon(response) {
  mainIcon.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
}

function changeWeatherDescription(response) {
  weatherDescription.innerHTML = `${response.data.weather[0].description}`
}

function showTime(current) {
  const date = current.getDate();
  const month = months[current.getMonth()];
  const year = current.getFullYear();
  const day = weekDays[current.getDay()];

  let hour = current.getHours();
  let minutes = current.getMinutes();

  return [date, month, year, day, hour, minutes];
}

function changeDate() {
  const dateElement = document.querySelector("#date");
  const date = showTime(new Date());

  dateElement.innerHTML = `${date[1]} ${date[0]}-${date[2]} - ${date[3]}`;
}

changeDate();

function changeTime() {
  const date = showTime(new Date());
  const timeElement = document.querySelector("#time");

  timeElement.innerHTML = `${date[4]} : ${
    date[5] < 10 ? "0" + date[5] : date[5]
  }`;
}

changeTime();

const searchForm = document.querySelector("#search-form");

searchForm.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  const searchFiled = document.querySelector("#search-field");
  const searchValue = searchFiled.value;

  changeTitleCity(searchValue);

  sendRequest(searchValue);
}

function changeDegree(response) {
  degree.innerHTML = `${Math.floor(
    response.data.main.temp)}`;
}

function changeTitleCity(city) {
  const title = document.querySelector("#current-city");
  title.innerHTML = city;
}

function handleDegreeClick(event) {
  event.preventDefault();
  if (event.target === celsiusLink) {
    degree.innerHTML = celsiusTemperature;
  } else {
    degree.innerHTML = `${Math.floor(celsiusTemperature * 1.8 + 32)}`;
  }
  celsiusLink.classList.toggle('active');
  fahrenheitLink.classList.toggle('active');
}

celsiusLink.addEventListener("click", handleDegreeClick);
fahrenheitLink.addEventListener("click", handleDegreeClick);

function updateWeatherDetails(response) {
  maxTemperature.innerHTML = Math.floor(response.data.main.temp_max);
  minTemperature.innerHTML = Math.floor(response.data.main.temp_min);
  feelsTemperature.innerHTML = Math.floor(response.data.main.feels_like);
  humidity.innerHTML = Math.floor(response.data.main.humidity);
  windSpeed.innerHTML = response.data.wind.speed;
}

function formatDate(timestamp) {
  let date = new Date(timestamp *1000);
  let day = date.getDay();
  return weekDays[day];
}

function createWeekForecast(response) {

  let forecast = response.data.daily;
  let forecastHTML = '';
  console.log(forecast)
  forecast.forEach((day, index) => {
    if(index <= 6){
      forecastHTML +=`<li className="week-item">
    <h3>${formatDate(day.dt)}</h3>
    <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" width="70" alt="${day.weather[0].description}">
      <ul>
        <li>
          Hi ${Math.floor(day.temp.max)} <sup>o</sup>
        </li>
        <li>
          Lo ${Math.floor(day.temp.min)} <sup>o</sup>
        </li>
      </ul>
  </li>`
    }
  })

  weekForecast.innerHTML = forecastHTML;

}

