const key = "a83f619db0bf9e35a21b85c461d75e1d";

const url = "https://api.openweathermap.org/data/2.5/weather";
const degree = document.querySelector("#degree");
const currentLocation = document.querySelector("#current-location");

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

function sendLocationRequest(latitude, longitude) {
  axios
    .get(`${url}?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`)
    .then(function (response) {
      changeTileCity(response.data.name);
      changeDegree(response);
      return response;
    });
}

function sendRequest(city) {
  axios
    .get(`${url}?q=${city}&appid=${key}&units=metric`)
    .then(function (response) {
      console.log(response);
      changeDegree(response);
      return response;
    });
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

  changeTileCity(searchValue);

  sendRequest(searchValue);
}

function changeDegree(response) {
  degree.innerHTML = `${Math.floor(
    response.data.main.temp
  )}<span>&#176;</span>`;
}

function changeTileCity(city) {
  const title = document.querySelector("#current-city");
  title.innerHTML = city;
}
