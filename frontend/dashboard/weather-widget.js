/**
 * Live Date, Time & Weather Widget
 * Using OpenWeatherMap API for weather data
 */

// OpenWeatherMap API Configuration
const OPENWEATHER_API_KEY = '1443ceb9220009ca024fcb53f55af3ef'; // OpenWeatherMap API key
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Update time every second
function updateDateTime() {
    const now = new Date();

    // Format time (12-hour with AM/PM)
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    const timeString = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;

    // Format date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);

    // Update DOM
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('currentDate');

    if (timeElement) timeElement.textContent = timeString;
    if (dateElement) dateElement.textContent = dateString;
}

// Get weather data from OpenWeatherMap API
async function fetchWeather() {
    try {
        // Check if API key is set
        if (OPENWEATHER_API_KEY === 'YOUR_API_KEY_HERE') {
            throw new Error('API key not configured. Please add your OpenWeatherMap API key.');
        }

        // First, get user's location
        if (!navigator.geolocation) {
            throw new Error('Geolocation not supported');
        }

        // Get coordinates
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                maximumAge: 300000 // Cache for 5 minutes
            });
        });

        const { latitude, longitude } = position.coords;

        // Fetch current weather data
        const weatherResponse = await fetch(
            `${OPENWEATHER_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );

        if (!weatherResponse.ok) {
            if (weatherResponse.status === 401) {
                throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
            }
            throw new Error('Weather API error');
        }

        const weatherData = await weatherResponse.json();

        // Fetch air quality data (optional - requires separate API call)
        let airQualityData = null;
        try {
            const airQualityResponse = await fetch(
                `${OPENWEATHER_BASE_URL}/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`
            );
            if (airQualityResponse.ok) {
                airQualityData = await airQualityResponse.json();
            }
        } catch (error) {
            console.log('Air quality data not available');
        }

        // Display weather data
        displayWeather(weatherData, airQualityData);

    } catch (error) {
        console.error('Weather fetch error:', error);
        displayWeatherError(error.message);
    }
}

// Get weather emoji based on OpenWeatherMap icon code
function getWeatherEmoji(iconCode, description) {
    const emojiMap = {
        '01d': '☀️',  // clear sky day
        '01n': '🌙',  // clear sky night
        '02d': '🌤️', // few clouds day
        '02n': '☁️',  // few clouds night
        '03d': '☁️',  // scattered clouds
        '03n': '☁️',
        '04d': '☁️',  // broken clouds
        '04n': '☁️',
        '09d': '🌧️', // shower rain
        '09n': '🌧️',
        '10d': '🌦️', // rain day
        '10n': '🌧️', // rain night
        '11d': '⛈️',  // thunderstorm
        '11n': '⛈️',
        '13d': '❄️',  // snow
        '13n': '❄️',
        '50d': '🌫️', // mist
        '50n': '🌫️'
    };

    return emojiMap[iconCode] || '🌡️';
}

// Get health tip based on weather conditions
function getHealthTip(weatherData, airQuality) {
    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].main.toLowerCase();
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    // Air quality based tips
    if (airQuality) {
        const aqi = airQuality.list[0].main.aqi;
        if (aqi >= 4) {
            return 'Air quality is poor. Avoid outdoor exercise and stay indoors!';
        } else if (aqi === 3) {
            return 'Moderate air quality. Limit intense outdoor activities!';
        }
    }

    // Weather condition based tips
    if (condition.includes('thunder') || condition.includes('storm')) {
        return 'Thunderstorm! Stay safe indoors and avoid outdoor activities!';
    } else if (condition.includes('rain')) {
        return 'Rainy weather! Perfect time for indoor yoga or meditation!';
    } else if (condition.includes('snow')) {
        return 'Snowy day! Dress warmly if going outside!';
    } else if (condition.includes('fog') || condition.includes('mist')) {
        return 'Low visibility! Be careful if exercising outdoors!';
    }

    // Temperature based tips
    if (temp > 35) {
        return 'Very hot! Stay hydrated and avoid outdoor activities during peak hours!';
    } else if (temp > 28) {
        return 'Warm weather! Great for swimming or light outdoor activities!';
    } else if (temp > 20) {
        return 'Perfect weather for outdoor exercise and activities!';
    } else if (temp > 10) {
        return 'Cool weather! Layer up for outdoor activities!';
    } else if (temp > 0) {
        return 'Cold weather! Dress warmly and stay active to keep warm!';
    } else {
        return 'Freezing! Limit outdoor exposure and dress in layers!';
    }
}

// Get air quality description
function getAirQualityDescription(aqi) {
    const descriptions = {
        1: { text: 'Good', color: '#10b981' },
        2: { text: 'Fair', color: '#22d3ee' },
        3: { text: 'Moderate', color: '#f59e0b' },
        4: { text: 'Poor', color: '#ef4444' },
        5: { text: 'Very Poor', color: '#dc2626' }
    };
    return descriptions[aqi] || { text: 'Unknown', color: '#6b7280' };
}

// Display weather data
function displayWeather(weatherData, airQualityData) {
    const weather = weatherData.weather[0];
    const main = weatherData.main;
    const wind = weatherData.wind;

    const weatherEmoji = getWeatherEmoji(weather.icon, weather.description);
    const healthTip = getHealthTip(weatherData, airQualityData);

    // Update weather content
    const weatherContent = document.getElementById('weatherContent');
    weatherContent.innerHTML = `
        <div class="weather-main">
            <div class="weather-emoji">${weatherEmoji}</div>
            <div class="weather-temp">${Math.round(main.temp)}°C</div>
            <div class="weather-desc">${weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}</div>
            <div class="weather-feels-like">Feels like ${Math.round(main.feels_like)}°C</div>
        </div>
    `;

    // Update weather details
    const weatherDetails = document.getElementById('weatherDetails');
    weatherDetails.style.display = 'grid';

    // Location
    const location = `${weatherData.name}, ${weatherData.sys.country}`;
    document.getElementById('weatherLocation').textContent = location;

    // Humidity
    document.getElementById('weatherHumidity').textContent = `${main.humidity}%`;

    // Wind
    const windKmh = (wind.speed * 3.6).toFixed(1); // Convert m/s to km/h
    document.getElementById('weatherWind').textContent = `${windKmh} km/h`;

    // Visibility
    const visibilityKm = weatherData.visibility ? (weatherData.visibility / 1000).toFixed(1) : 'N/A';
    document.getElementById('weatherVisibility').textContent = `${visibilityKm} km`;

    // Update health tip
    document.getElementById('weatherTip').textContent = `💡 ${healthTip}`;

    // Add air quality if available
    if (airQualityData) {
        const aqi = airQualityData.list[0].main.aqi;
        const aqiInfo = getAirQualityDescription(aqi);

        // Add air quality to details if not already there
        const existingAQI = document.getElementById('weatherAQI');
        if (!existingAQI) {
            const aqiElement = document.createElement('div');
            aqiElement.className = 'weather-item';
            aqiElement.innerHTML = `
                <span>🌬️ Air Quality</span>
                <strong id="weatherAQI" style="color: ${aqiInfo.color}">${aqiInfo.text}</strong>
            `;
            weatherDetails.appendChild(aqiElement);
        } else {
            existingAQI.textContent = aqiInfo.text;
            existingAQI.style.color = aqiInfo.color;
        }
    }
}

// Display error message
function displayWeatherError(message) {
    const weatherContent = document.getElementById('weatherContent');

    let errorMessage = message;
    let errorDetails = '';

    if (message.includes('API key')) {
        errorMessage = 'API Key Required';
        errorDetails = 'Please add your OpenWeatherMap API key to weather-widget.js';
    } else if (message.includes('Geolocation')) {
        errorMessage = 'Location Access Denied';
        errorDetails = 'Enable location access in browser settings';
    } else {
        errorMessage = 'Unable to Load Weather';
        errorDetails = 'Please try again later';
    }

    weatherContent.innerHTML = `
        <div class="weather-error">
            <div class="error-icon">⚠️</div>
            <p>${errorMessage}</p>
            <small>${errorDetails}</small>
        </div>
    `;

    // Hide details
    document.getElementById('weatherDetails').style.display = 'none';
    document.getElementById('weatherTip').textContent = '💡 Enable location and add API key for weather updates!';
}

// Refresh weather data
function refreshWeather() {
    const refreshBtn = document.querySelector('.weather-refresh');
    if (refreshBtn) {
        refreshBtn.style.animation = 'spin 1s linear';
        setTimeout(() => {
            refreshBtn.style.animation = '';
        }, 1000);
    }

    fetchWeather();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Start clock
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Fetch weather immediately
    fetchWeather();

    // Refresh weather every 10 minutes
    setInterval(fetchWeather, 600000);
});

// Make functions globally available
window.refreshWeather = refreshWeather;
