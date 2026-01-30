// Environment Page JavaScript with OpenWeatherMap API Integration

const OPENWEATHER_API_KEY = '1443ceb9220009ca024fcb53f55af3ef';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

let hourlyChart = null;
let temperatureChart = null;
let currentLocation = null;
let currentCoords = { lat: null, lon: null };

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    updateDate();
    setupCharts();
    getUserLocation();
    setInterval(updateDate, 60000); // Update date every minute
});

// Update Date
function updateDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
}

// Get User Location
async function getUserLocation() {
    try {
        if (!navigator.geolocation) {
            throw new Error('Geolocation not supported');
        }

        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                maximumAge: 300000
            });
        });

        currentCoords.lat = position.coords.latitude;
        currentCoords.lon = position.coords.longitude;

        await loadWeatherData();
    } catch (error) {
        console.error('Location error:', error);
        showNotification('Unable to get location. Using default location.', 'warning');
        // Fallback to a default location (New York)
        currentCoords.lat = 40.7128;
        currentCoords.lon = -74.0060;
        await loadWeatherData();
    }
}

// Load Weather Data from OpenWeatherMap API
async function loadWeatherData() {
    try {
        if (!currentCoords.lat || !currentCoords.lon) {
            throw new Error('No coordinates available');
        }

        // Show loading state
        showLoadingState();

        // Fetch current weather
        const weatherResponse = await fetch(
            `${OPENWEATHER_BASE_URL}/weather?lat=${currentCoords.lat}&lon=${currentCoords.lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
        );

        if (!weatherResponse.ok) throw new Error('Weather API error');
        const weatherData = await weatherResponse.json();

        // Fetch air quality
        let airQualityData = null;
        try {
            const aqiResponse = await fetch(
                `${OPENWEATHER_BASE_URL}/air_pollution?lat=${currentCoords.lat}&lon=${currentCoords.lon}&appid=${OPENWEATHER_API_KEY}`
            );
            if (aqiResponse.ok) {
                airQualityData = await aqiResponse.json();
            }
        } catch (error) {
            console.log('Air quality data not available');
        }

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
            `${OPENWEATHER_BASE_URL}/forecast?lat=${currentCoords.lat}&lon=${currentCoords.lon}&appid=${OPENWEATHER_API_KEY}&units=imperial`
        );

        let forecastData = null;
        if (forecastResponse.ok) {
            forecastData = await forecastResponse.json();
        }

        // Process and display data
        processWeatherData(weatherData, airQualityData, forecastData);

    } catch (error) {
        console.error('Weather fetch error:', error);
        showNotification('Unable to load weather data. Please try again.', 'error');
        hideLoadingState();
    }
}

// Show Loading State
function showLoadingState() {
    const elements = ['currentTemp', 'weatherDescription', 'humidity', 'windSpeed'];
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = 'Loading...';
    });
}

// Hide Loading State
function hideLoadingState() {
    // Loading state will be hidden when data is populated
}

// Process Weather Data
function processWeatherData(weather, airQuality, forecast) {
    // Extract data
    const weatherInfo = {
        location: `${weather.name}, ${weather.sys.country}`,
        current: {
            temp: Math.round(weather.main.temp),
            feelsLike: Math.round(weather.main.feels_like),
            high: Math.round(weather.main.temp_max),
            low: Math.round(weather.main.temp_min),
            description: weather.weather[0].description,
            icon: getWeatherEmoji(weather.weather[0].icon),
            humidity: weather.main.humidity,
            windSpeed: Math.round(weather.wind.speed),
            windDir: getWindDirection(weather.wind.deg),
            windDeg: weather.wind.deg,
            pressure: weather.main.pressure,
            visibility: (weather.visibility / 1609).toFixed(1), // Convert meters to miles
            precipitation: 0, // Not available in current weather
            sunrise: formatTime(weather.sys.sunrise),
            sunset: formatTime(weather.sys.sunset),
            uvIndex: 0 // Not available in free tier, would need One Call API
        },
        aqi: airQuality ? processAQIData(airQuality) : getDefaultAQI(),
        forecast: forecast ? processForecastData(forecast) : [],
        hourly: forecast ? processHourlyData(forecast) : [],
        pollen: {
            overall: 'N/A',
            tree: 'N/A',
            grass: 'N/A',
            weed: 'N/A'
        }
    };

    // Calculate heat index
    weatherInfo.current.heatIndex = calculateHeatIndex(weatherInfo.current.temp, weatherInfo.current.humidity);

    // Update displays
    updateWeatherDisplay(weatherInfo);
    updateAQIDisplay(weatherInfo.aqi);
    updateForecast(weatherInfo.forecast);
    updateHourlyChart(weatherInfo.hourly);
    updateTemperatureChartWithData(weatherInfo.hourly);
    updateEnvironmentalFactors(weatherInfo);
    updateAlerts(weatherInfo);

    hideLoadingState();
}

// Get Weather Emoji
function getWeatherEmoji(iconCode) {
    const emojiMap = {
        '01d': '☀️', '01n': '🌙',
        '02d': '🌤️', '02n': '☁️',
        '03d': '☁️', '03n': '☁️',
        '04d': '☁️', '04n': '☁️',
        '09d': '🌧️', '09n': '🌧️',
        '10d': '🌦️', '10n': '🌧️',
        '11d': '⛈️', '11n': '⛈️',
        '13d': '❄️', '13n': '❄️',
        '50d': '🌫️', '50n': '🌫️'
    };
    return emojiMap[iconCode] || '🌡️';
}

// Get Wind Direction
function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Format Unix Timestamp to Time
function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// Calculate Heat Index
function calculateHeatIndex(temp, humidity) {
    if (temp < 80) return temp;

    const T = temp;
    const RH = humidity;

    let HI = -42.379 + 2.04901523 * T + 10.14333127 * RH
        - 0.22475541 * T * RH - 0.00683783 * T * T
        - 0.05481717 * RH * RH + 0.00122874 * T * T * RH
        + 0.00085282 * T * RH * RH - 0.00000199 * T * T * RH * RH;

    return Math.round(HI);
}

// Process AQI Data
function processAQIData(aqiData) {
    const components = aqiData.list[0].components;
    const aqi = aqiData.list[0].main.aqi;

    return {
        value: convertAQIToUS(aqi),
        level: getAQILevelText(aqi),
        pm25: components.pm2_5.toFixed(1),
        pm10: components.pm10.toFixed(1),
        ozone: (components.o3 || 0).toFixed(0),
        no2: (components.no2 || 0).toFixed(0),
        co: (components.co / 1000).toFixed(1),
        so2: (components.so2 || 0).toFixed(0)
    };
}

// Convert European AQI (1-5) to US AQI scale (0-500)
function convertAQIToUS(europeanAQI) {
    const conversion = {
        1: 25,   // Good
        2: 75,   // Fair
        3: 125,  // Moderate
        4: 175,  // Poor
        5: 250   // Very Poor
    };
    return conversion[europeanAQI] || 50;
}

// Get AQI Level Text
function getAQILevelText(aqi) {
    const levels = {
        1: 'good',
        2: 'fair',
        3: 'moderate',
        4: 'poor',
        5: 'very poor'
    };
    return levels[aqi] || 'good';
}

// Get Default AQI
function getDefaultAQI() {
    return {
        value: 50,
        level: 'good',
        pm25: 'N/A',
        pm10: 'N/A',
        ozone: 'N/A',
        no2: 'N/A',
        co: 'N/A',
        so2: 'N/A'
    };
}

// Process Forecast Data
function processForecastData(forecastData) {
    const dailyForecasts = [];
    const processedDays = new Set();

    forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();

        if (!processedDays.has(dayKey) && dailyForecasts.length < 7) {
            processedDays.add(dayKey);

            const dayName = dailyForecasts.length === 0 ? 'Today' :
                dailyForecasts.length === 1 ? 'Tomorrow' :
                    date.toLocaleDateString('en-US', { weekday: 'short' });

            dailyForecasts.push({
                day: dayName,
                icon: getWeatherEmoji(item.weather[0].icon),
                high: Math.round(item.main.temp_max),
                low: Math.round(item.main.temp_min),
                desc: item.weather[0].description
            });
        }
    });

    return dailyForecasts;
}

// Process Hourly Data
function processHourlyData(forecastData) {
    const hourlyData = [];

    for (let i = 0; i < Math.min(24, forecastData.list.length); i++) {
        const item = forecastData.list[i];
        const date = new Date(item.dt * 1000);

        hourlyData.push({
            time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
            temp: Math.round(item.main.temp)
        });
    }

    return hourlyData;
}

// Update Weather Display
function updateWeatherDisplay(data) {
    document.getElementById('currentLocation').textContent = data.location;
    document.getElementById('currentTemp').textContent = data.current.temp;
    document.getElementById('feelsLike').textContent = data.current.feelsLike + '°F';
    document.getElementById('tempRange').textContent = data.current.high + '°F / ' + data.current.low + '°F';
    document.getElementById('weatherIcon').textContent = data.current.icon;
    document.getElementById('weatherDescription').textContent = data.current.description.charAt(0).toUpperCase() + data.current.description.slice(1);

    document.getElementById('humidity').textContent = data.current.humidity + '%';
    document.getElementById('humidityBar').style.width = data.current.humidity + '%';

    document.getElementById('windSpeed').textContent = data.current.windSpeed + ' mph';
    document.getElementById('windDir').textContent = data.current.windDir;
    updateWindArrow(data.current.windDir);

    document.getElementById('pressure').textContent = data.current.pressure + ' hPa';

    // UV Index - set to moderate as placeholder (not available in free tier)
    document.getElementById('uvIndex').textContent = '5';
    updateUVLevel(5);

    document.getElementById('sunrise').textContent = data.current.sunrise;
    document.getElementById('sunset').textContent = data.current.sunset;
}

// Update Wind Arrow
function updateWindArrow(direction) {
    const directions = {
        'N': '↑', 'NE': '↗', 'E': '→', 'SE': '↘',
        'S': '↓', 'SW': '↙', 'W': '←', 'NW': '↖'
    };
    const arrow = document.getElementById('windArrow');
    arrow.textContent = directions[direction] || '→';
}

// Update UV Level
function updateUVLevel(uvIndex) {
    const uvElement = document.getElementById('uvLevel');
    let level, className;

    if (uvIndex <= 2) {
        level = 'Low';
        className = 'low';
    } else if (uvIndex <= 5) {
        level = 'Moderate';
        className = 'moderate';
    } else if (uvIndex <= 7) {
        level = 'High';
        className = 'high';
    } else {
        level = 'Very High';
        className = 'high';
    }

    uvElement.textContent = level;
    uvElement.className = 'uv-level ' + className;
}

// Update AQI Display
function updateAQIDisplay(aqi) {
    document.getElementById('aqiValue').textContent = aqi.value;
    document.getElementById('aqiBadge').textContent = aqi.level.charAt(0).toUpperCase() + aqi.level.slice(1);
    document.getElementById('aqiBadge').className = 'aqi-badge ' + aqi.level.replace(' ', '-');

    // Update gauge
    const gauge = document.getElementById('aqiGauge');
    const percentage = (aqi.value / 300) * 100;
    gauge.style.width = Math.min(percentage, 100) + '%';
    gauge.className = 'gauge-fill ' + getAQILevel(aqi.value);

    // Update breakdown
    document.getElementById('pm25').textContent = aqi.pm25 + ' µg/m³';
    document.getElementById('pm10').textContent = aqi.pm10 + ' µg/m³';
    document.getElementById('ozone').textContent = aqi.ozone + ' µg/m³';
    document.getElementById('no2').textContent = aqi.no2 + ' µg/m³';
    document.getElementById('co').textContent = aqi.co + ' mg/m³';
    document.getElementById('so2').textContent = aqi.so2 + ' µg/m³';
}

// Get AQI Level
function getAQILevel(value) {
    if (value <= 50) return 'good';
    if (value <= 100) return 'moderate';
    if (value <= 150) return 'unhealthy-sensitive';
    return 'unhealthy';
}

// Update Forecast
function updateForecast(forecast) {
    const forecastList = document.getElementById('forecastList');
    forecastList.innerHTML = '';

    forecast.forEach(day => {
        const item = document.createElement('div');
        item.className = 'forecast-item';
        item.innerHTML = `
            <div class="forecast-day">${day.day}</div>
            <div class="forecast-icon">${day.icon}</div>
            <div class="forecast-temps">
                <span class="forecast-high">${day.high}°</span>
                <span class="forecast-low">${day.low}°</span>
            </div>
            <div class="forecast-desc">${day.desc}</div>
        `;
        forecastList.appendChild(item);
    });
}

// Setup Charts
function setupCharts() {
    setupHourlyChart();
    setupTemperatureChart();
}

// Setup Hourly Chart
function setupHourlyChart() {
    const ctx = document.getElementById('hourlyChart');
    if (!ctx) return;

    hourlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°F)',
                data: [],
                borderColor: 'rgba(45,212,191,1)',
                backgroundColor: 'rgba(45,212,191,0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    }
                }
            }
        }
    });
}

// Setup Temperature Chart
function setupTemperatureChart() {
    const ctx = document.getElementById('temperatureChart');
    if (!ctx) return;

    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°F)',
                data: [],
                borderColor: 'rgba(45,212,191,1)',
                backgroundColor: 'rgba(45,212,191,0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    }
                }
            }
        }
    });
}

// Update Hourly Chart
function updateHourlyChart(hourlyData) {
    if (!hourlyChart) return;

    hourlyChart.data.labels = hourlyData.map(h => h.time);
    hourlyChart.data.datasets[0].data = hourlyData.map(h => h.temp);
    hourlyChart.update();
}

// Update Temperature Chart with Data
function updateTemperatureChartWithData(hourlyData) {
    if (!temperatureChart) return;

    temperatureChart.data.labels = hourlyData.map(h => h.time);
    temperatureChart.data.datasets[0].data = hourlyData.map(h => h.temp);
    temperatureChart.update();
}

// Update Environmental Factors
function updateEnvironmentalFactors(data) {
    document.getElementById('pollenCount').textContent = data.pollen.overall;

    document.getElementById('heatIndex').textContent = data.current.heatIndex + '°F';
    document.getElementById('heatStatus').textContent = getHeatStatus(data.current.heatIndex);

    document.getElementById('visibility').textContent = data.current.visibility + ' mi';

    document.getElementById('precipitation').textContent = data.current.precipitation + '%';
}

// Get Heat Status
function getHeatStatus(heatIndex) {
    if (heatIndex < 80) return 'Comfortable';
    if (heatIndex < 90) return 'Caution';
    if (heatIndex < 105) return 'Extreme Caution';
    return 'Danger';
}

// Update Alerts
function updateAlerts(data) {
    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '';

    const alerts = [];

    // UV Index alert
    if (data.current.uvIndex >= 6) {
        alerts.push({
            type: 'warning',
            icon: '⚠️',
            title: 'UV Index ' + (data.current.uvIndex >= 8 ? 'High' : 'Moderate'),
            message: 'Wear sunscreen and protective clothing when outdoors'
        });
    }

    // AQI alert
    if (data.aqi.value > 100) {
        alerts.push({
            type: 'danger',
            icon: '🚨',
            title: 'Air Quality Alert',
            message: 'Air quality is unhealthy. Limit outdoor activities.'
        });
    }

    // Heat alert
    if (data.current.heatIndex >= 90) {
        alerts.push({
            type: 'warning',
            icon: '🌡️',
            title: 'Heat Advisory',
            message: 'High heat index. Stay hydrated and avoid prolonged sun exposure.'
        });
    }

    if (alerts.length === 0) {
        alerts.push({
            type: 'info',
            icon: 'ℹ️',
            title: 'All Clear',
            message: 'No environmental alerts at this time'
        });
    }

    alerts.forEach(alert => {
        const item = document.createElement('div');
        item.className = 'alert-item ' + alert.type;
        item.innerHTML = `
            <div class="alert-icon-small">${alert.icon}</div>
            <div class="alert-content">
                <h4>${alert.title}</h4>
                <p>${alert.message}</p>
            </div>
        `;
        alertsList.appendChild(item);
    });
}

// Update Location
async function updateLocation() {
    const locationInput = document.getElementById('locationInput');
    const location = locationInput.value.trim();

    if (location) {
        try {
            // Use Geocoding API to get coordinates from city name
            const geocodeResponse = await fetch(
                `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${OPENWEATHER_API_KEY}`
            );

            if (!geocodeResponse.ok) throw new Error('Geocoding error');

            const geocodeData = await geocodeResponse.json();

            if (geocodeData.length === 0) {
                showNotification('Location not found. Please try again.', 'error');
                return;
            }

            currentCoords.lat = geocodeData[0].lat;
            currentCoords.lon = geocodeData[0].lon;

            await loadWeatherData();
            showNotification('Location updated to ' + location, 'success');
            locationInput.value = '';
        } catch (error) {
            console.error('Location update error:', error);
            showNotification('Unable to update location. Please try again.', 'error');
        }
    } else {
        showNotification('Please enter a location', 'error');
    }
}

// Refresh Data
async function refreshData() {
    const refreshBtn = document.querySelector('.btn-refresh');
    refreshBtn.style.animation = 'spin 1s linear';

    try {
        await loadWeatherData();
        showNotification('Weather data refreshed', 'success');
    } catch (error) {
        showNotification('Unable to refresh data', 'error');
    } finally {
        setTimeout(() => {
            refreshBtn.style.animation = '';
        }, 1000);
    }
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add spin animation for refresh button
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        z-index: 10000;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .notification-success {
        background: linear-gradient(135deg, #10b981, #059669);
    }
    
    .notification-error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
    }
    
    .notification-warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
    }
    
    .notification-info {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
    }
`;
document.head.appendChild(style);
