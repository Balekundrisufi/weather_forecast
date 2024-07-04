
const apiKey = 'f26ab2d9ea64bce69402916302f74ecd';// api key to be filled
Process.env.WEATHER_API_KEY;

async function getWeather() {
    const location = document.getElementById('locationInput').value;
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    try {
        // Fetch current weather data
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        if (!currentWeatherResponse.ok) {
            throw new Error('Network response was not ok ' + currentWeatherResponse.statusText);
        }
        const currentWeatherData = await currentWeatherResponse.json();
        displayCurrentWeather(currentWeatherData);

        // Fetch forecast data
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error('Network response was not ok ' + forecastResponse.statusText);
        }
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

// Function to display current weather data
function displayCurrentWeather(data) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    const weatherHTML = `<center><div>
        <h2>Current Weather in ${data.name}</h2>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Weather: ${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        </center></div>
    `;
    currentWeatherDiv.innerHTML = weatherHTML;
}

// Function to display forecast data
function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = `<center><h2>5-Day Forecast for ${data.city.name}</h2></center>`;

    // Group the forecast data by day
    const forecastByDay = {};
    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toDateString();
        if (!forecastByDay[date]) {
            forecastByDay[date] = [];
        }
        forecastByDay[date].push(forecast);
    });

    // Display forecast data
    for (const [date, forecasts] of Object.entries(forecastByDay)) {
        const dayHigh = Math.max(...forecasts.map(f => f.main.temp_max));
        const dayLow = Math.min(...forecasts.map(f => f.main.temp_min));
        const weatherDescription = forecasts[0].weather[0].description;

        const weatherHTML = `
           <center> <div class="weather-day">
                <h3>${date}</h3>
                <p>High: ${dayHigh} °C</p>
                <p>Low: ${dayLow} °C</p>
                <p>Weather: ${weatherDescription}</p>
                <br><br>
            </div></center>
        `;
        forecastDiv.innerHTML += weatherHTML;
    }
}
