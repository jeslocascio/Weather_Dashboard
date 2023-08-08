let APIKey = "c633fd4b273742bfd654971bae9fc128";

const getWeather = (city) => {
    let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey + "&units=imperial";
    fetch(queryURL)
      .then(function (response) {
        // Alert if valid city is not entered
        if (!response.ok) {
          alert("Please enter valid city name");
          return;
        }
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        let humidity = data.main.humidity;
        let windSpeed = data.wind.speed;
        let temp = data.main.temp;
        let name = data.name;
        console.log(temp, humidity, windSpeed);
        placeName.textContent = name;
        howHumid.textContent = humidity + "%";
        howHot.textContent = temp + " °F";
        howWindy.textContent = windSpeed + " mph";
        mostRecent.textContent = name;

        const lat = data.coord.lat;
        const lon = data.coord.lon;
        getFiveDay(lat, lon);
        // displayWeather(data);
      });

  };

function getFiveDay(lat, lon) {
    let fiveDay = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`;
    fetch (fiveDay)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
          for (let i = 0; i < data.list.length; i+=8) {
            console.log('i', data.list[i]);
          };
        })
}

let cityInput = document.getElementById("city");
let search = document.getElementById("check");
search.addEventListener("click", () => {
    let citySearched = cityInput.value;
    if (!citySearched) {
      alert("Please enter a city");
      return;
    }
    console.log(citySearched);
    // saveToLocalStorage(citySearched);
    getWeather(citySearched);
  });

  let placeName = document.getElementById("cityName");
  let howHot = document.getElementById("temp");
  let howHumid = document.getElementById("humid");
  let howWindy = document.getElementById("wind");
  let mostRecent = document.getElementById("last_Search");
