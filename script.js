
const API_KEY = "dc1adf0a01f2ea6709aaf0a92c9a7d37"; 
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherBox = document.getElementById("weatherResult");
const historyBox = document.getElementById("history");
const logBox = document.getElementById("logBox");


function log(message) {
    console.log(message);
    logBox.textContent += message + "\n";
}


async function getWeather(city) {
    log("Function Started");
    log("Before fetch()");

    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        log("After fetch() - Response Received");

        if (!response.ok) {
            throw new Error("Invalid city name");
        }
        const data = await response.json();
        log("JSON Parsed");

        displayWeather(data);
        saveCity(city);
    } catch (error) {
        log("Error: " + error.message);
        showError("City not found or Network error");
    }
    log("Function Ended");
}


function getWeatherUsingPromise(city) {
    log("Promise Version Started");

    fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Invalid city");
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            saveCity(city);
        })
        .catch(error => {
            log("Promise Error: " + error.message);
            showError("Something went wrong");
        });
}


function displayWeather(data) {

    weatherBox.innerHTML = `
           <p><strong>City:</strong> ${data.name}</p>
           <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
           <p><strong>Weather:</strong> ${data.weather[0].description}</p>
           <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
              <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
    `;
}


function showError(message) {
    weatherBox.innerHTML = `<span style="color: red;">${message}</span>`;
}


function saveCity(city) {

    let cities = JSON.parse(localStorage.getItem("weatherCities")) || [];

    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("weatherCities", JSON.stringify(cities));
    }
    loadHistory();
}


function loadHistory() {

    historyBox.innerHTML = "";

    let cities = JSON.parse(localStorage.getItem("weatherCities")) || [];

    cities.forEach(city => {
        const btn = document.createElement("button");
        btn.textContent = city;

        btn.addEventListener("click", () => {
            getWeather(city);
        });
        historyBox.appendChild(btn);
    });
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (!city) {
        showError("Please enter a city name");
        return;
    }
    log("Button Clicked");

    getWeather(city);

    cityInput.value = "";
});

window.addEventListener("load", () => {
    log("Page Loaded");
    loadHistory();
});
