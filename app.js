// API source: https://openweathermap.org/current

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector(".form-container");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// needed initial variables:
const API_KEY = "d98a7c7e810430218d802cc60b0e9269";

let currentTab = userTab;
currentTab.classList.add("current-tab");
//something is pending
//here we are at userTab so // check local storage for coordinates and display weather accordingly
getFromSessionStorage();

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      // already in search tab now I want to visible weather
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //here we are at userTab so // check local storage for coordinates and display weather accordingly
      getFromSessionStorage();
    }
  }
}

userTab.addEventListener("click", () => {
  //cliked tab as input parameter
  switchTab(userTab);
});

searchTab.addEventListener("click", () => {
  //cliked tab as input parameter
  switchTab(searchTab);
});

// checks whether the coordinates are stored in local storage or not
function getFromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    // no coordinates in local storage
    grantAccessContainer.classList.add("active");
  } else {
    // means data present in local storage (then covert data into JSON formate and give in function to fetch weather information)
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  //save coordinates data into latitude and logitude variables
  const { lat, lon } = coordinates;

  //make grant location container invisible
  grantAccessContainer.classList.remove("active");

  // make loader visible
  loadingScreen.classList.add("active");

  // API call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    const data = await response.json();

    // now remove loader and display userInfoContainer
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");

    // show data to UI screen
    renderWeatherInfo(data);
  } catch (error) {
    loadingScreen.classList.remove("active");
    // pending (procrastinated)
    alert("Error: ", error.message);
  }
}

function renderWeatherInfo(weatherInfo) {
  // fistly fetch the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDisc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");

  // now put it into UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} K`;
  windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity} %`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

// grant access for current location
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // show alert for no location find (procrastinated)
    alert(
      "Sorry, we can't get your geoLocation Information. But, You can try by Searching City manually"
    );
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

// now, for search result
const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let cityName = searchInput.value;

  if (cityName === "") {
    return;
  } else {
    fetchSearchWeatherInfo(cityName);
  }
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    const data = await response.json();

    if (data.cod == "404") {
      throw error;
    } else {
      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");

      renderWeatherInfo(data);
    }
  } catch (error) {
    // procrastinated things :)
    alert("Enter valid city name !");
  }
}

/*
practice code for API call
console.log("try");

const API_KEY = "d98a7c7e810430218d802cc60b0e9269";

function renderWeatherInfo(data) {
  let newPara = document.createElement("p");
  newPara.textContent = `${data?.main?.temp.toFixed(2)} K`;

  document.body.appendChild(newPara);
}

async function fetchWeatherDetails() {
  try {
    let city = "goa";

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    const data = await response.json();

    console.log("weather data: ", data);

    renderWeatherInfo(data);
  } catch (err) {
    console.log("Error found: ", err);
  }
}

async function getCurrentWeatherDetails() {
  try {
    let latitude = 22.307159;
    let longitude = 73.181221;

    let result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    );
    let data = await result.json();

    console.log("weather data: ", data);

    renderWeatherInfo(data);
  } catch (err) {
    console.log("Error found: ", err);
  }
}

function switchTab() {
  apiErrorContainer.classList.remove("active");

  if (clickedTab !== currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForam.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      // getFromSessionStorage();
    }
    // console.log("current tab; ", currentTab);
  }
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("NO geoLocation support in your browser!!!");
  }
}

function showPosition(position) {
  let lat = position.coords.latitude;
  let longi = position.coords.longitude;

  console.log(lat);
  console.log(longi);
}
*/
