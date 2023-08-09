// API key for OpenWeatherMap
const APIKey = "c633fd4b273742bfd654971bae9fc128";

// Elements for weather data display
const placeName = document.getElementById("cityName");
const howHot = document.getElementById("temp");
const howHumid = document.getElementById("humid");
const howWindy = document.getElementById("wind");
const mostRecent = document.getElementById("last_Search");
const theDay = document.getElementById("the_date");
const container = document.getElementById("repos-container");


// Loop through the forecast elements and labels them 1 through 5
for (let i = 1; i <= 5; i++) {
  // Creates the structure for each forecast card
  const card = document.createElement("div");
  card.className = "card shadow-0 border";
  
  const cardBody = document.createElement("div");
  cardBody.className = "card-body p-4";
  
  const cityName = document.createElement("h4");
  cityName.className = "mb-1 sfw-normal";
  cityName.id = "future_cityName_" + i;
  cityName.textContent = "City";
  
  const date = document.createElement("p");
  date.className = "mb-2";
  date.innerHTML = "<strong id='future_date_" + i + "'></strong>";
  
  const temp = document.createElement("p");
  temp.className = "mb-2";
  temp.innerHTML = "Current temperature: <strong id='future_temp_" + i + "'></strong>";
  
  const humid = document.createElement("p");
  humid.innerHTML = "Humidity: <strong id='future_humid_" + i + "'></strong>";
  
  const wind = document.createElement("p");
  wind.innerHTML = "Wind Speed: <strong id='future_wind_" + i + "'></strong>";
  
  const weatherIcon = document.createElement("div");
  weatherIcon.className = "d-flex flex-row align-items-center";
  const iconImage = document.createElement("img");
  iconImage.id = "future_weatherIcon_" + i;
  weatherIcon.appendChild(iconImage);
  
  // Append elements to their respective parent elements
  cardBody.appendChild(cityName);
  cardBody.appendChild(date);
  cardBody.appendChild(temp);
  cardBody.appendChild(humid);
  cardBody.appendChild(wind);
  cardBody.appendChild(weatherIcon);
  
  card.appendChild(cardBody);
  
  // Append the card to the container
  container.appendChild(card);
}


// Create an array to hold forecast elements
const futureElements = [];

// Loops through the forecast elements and assigns them JS variables
for (let i = 1; i <= 5; i++) {
  // Get references to forecast elements using their IDs
  const cityName = document.getElementById("future_cityName_" + i);
  const date = document.getElementById("future_date_" + i);
  const temp = document.getElementById("future_temp_" + i);
  const humid = document.getElementById("future_humid_" + i);
  const wind = document.getElementById("future_wind_" + i);
  const weatherIcon = document.getElementById("future_weatherIcon_" + i);
  
  // Creates an object to store references to the elements
  const forecastElement = {
    cityName: cityName,
    date: date,
    temp: temp,
    humid: humid,
    wind: wind,
    weatherIcon: weatherIcon
  };
  
  // Pushes the object into the futureElements array
  futureElements.push(forecastElement);
}

// Function to fetch the current day's weather data for a city based on search
const getWeather = (city) => {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=imperial`;

  fetch(queryURL)
    .then(function (response) {
      if (!response.ok) {
        alert("Please enter a valid city name");
        return;
      }
      return response.json();
    })
    .then(function (data) {
      // Extracts weather data
      let date = new Date(data.dt * 1000).toDateString();
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const temp = data.main.temp;
      const name = data.name;
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
      
      // Showcases the weather data on the page
      document.getElementById('weatherIcon').src = iconUrl;
      placeName.textContent = name;
      theDay.textContent = date;
      howHumid.textContent = humidity + "%";
      howHot.textContent = temp + " °F";
      howWindy.textContent = windSpeed + " mph";
      mostRecent.textContent = name;
      

      // Stores the searched city and saves to the Previous Searches bar
      if (!previousSearches.includes(name)) {
        previousSearches.push(name);
        renderPreviousSearches();
      }

      // Fetches and displays five-day forecast
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      getFiveDay(lat, lon, name); // Pass the city name to getFiveDay

      
    });
};

// Function to fetch the weather forecast of a city over the next five days
function getFiveDay(lat, lon, city) {

  const fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;

  fetch(fiveDayURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Processes and displays five-day forecast data
      for (let i = 1; i <= 5; i++) {
        const forecast = data.list[i * 8 - 1]; // Get forecast data for each day
        const forecastDate = new Date(forecast.dt * 1000).toDateString();
        
        futureElements[i - 1].cityName.textContent = city;
        futureElements[i - 1].date.textContent = forecastDate;
        futureElements[i - 1].temp.textContent = forecast.main.temp + " °F";
        futureElements[i - 1].humid.textContent = forecast.main.humidity + "%";
        futureElements[i - 1].wind.textContent = forecast.wind.speed + " mph";
        
        const iconCode = forecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
        futureElements[i - 1].weatherIcon.src = iconUrl;
      }
    });
}

// Searches for a city's weather after clicking the search button
const search = document.getElementById("check");
search.addEventListener("click", () => {
  const citySearched = cityInput.value;
  if (!citySearched) {
    alert("Please enter a city");
    return;
  }
  getWeather(citySearched);
});

// Input field for city search
const cityInput = document.getElementById("city");

// Array to store previous search cities
const previousSearches = [];

// Function to add previous searches to buttons, and list them
const renderPreviousSearches = () => {
  const languageButtons = document.getElementById("language-buttons");
  languageButtons.innerHTML = ""; // Clear existing buttons
  
  previousSearches.forEach((searchCity) => {
    const button = document.createElement("button");
    button.textContent = searchCity;
    button.className = "btn";
    
    // Adds click event listener to each button
    button.addEventListener("click", () => {
      getWeather(searchCity);
    });
    
    languageButtons.appendChild(button);
  });
};