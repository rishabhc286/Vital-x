# 🔑 OpenWeatherMap API Setup Guide

## ✅ Updated to OpenWeatherMap API!

Your weather widget now uses **OpenWeatherMap API** for more accurate and detailed weather data!

---

## 🎯 What You Get with OpenWeatherMap

### **Enhanced Features:**
- ✅ More accurate weather data
- ✅ **Air Quality Index (AQI)** - NEW!
- ✅ Detailed weather descriptions
- ✅ Precise temperature & feels-like
- ✅ Wind speed & direction
- ✅ Visibility data
- ✅ Humidity levels
- ✅ Weather icons
- ✅ City name & country code

### **Air Quality Levels:**
- 🟢 **Good** (AQI 1) - Perfect for outdoor activities
- 🔵 **Fair** (AQI 2) - Acceptable air quality
- 🟡 **Moderate** (AQI 3) - Limit intense outdoor activities
- 🔴 **Poor** (AQI 4) - Avoid outdoor exercise
- 🔴 **Very Poor** (AQI 5) - Stay indoors!

---

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Get Your Free API Key**

1. **Go to OpenWeatherMap**:
   - Visit: [https://openweathermap.org/api](https://openweathermap.org/api)

2. **Sign Up** (Free):
   - Click "Sign Up" in top right
   - Fill in your details
   - Verify your email

3. **Get API Key**:
   - After login, go to: [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys)
   - You'll see a default API key already created
   - Or click "Generate" to create a new one
   - **Copy the API key** (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

4. **Wait 10-15 Minutes**:
   - New API keys take 10-15 minutes to activate
   - Don't worry if it doesn't work immediately!

---

### **Step 2: Add API Key to Your Code**

1. **Open the file**:
   ```
   frontend/dashboard/weather-widget.js
   ```

2. **Find this line** (near the top):
   ```javascript
   const OPENWEATHER_API_KEY = 'YOUR_API_KEY_HERE';
   ```

3. **Replace with your API key**:
   ```javascript
   const OPENWEATHER_API_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
   ```

4. **Save the file**

---

### **Step 3: Test It!**

1. **Open dashboard** in browser
2. **Allow location access** when prompted
3. **Wait 2-3 seconds** for weather to load
4. **You should see**:
   - ✅ Current temperature
   - ✅ Weather description
   - ✅ Your city name
   - ✅ Air quality (if available)
   - ✅ Weather details

---

## 📋 Free Tier Limits

OpenWeatherMap **Free Plan** includes:

| Feature | Limit |
|---------|-------|
| API Calls | 1,000 calls/day |
| Updates | Every 10 minutes |
| Current Weather | ✅ Included |
| Air Quality | ✅ Included |
| Forecast | ❌ Paid only |
| Historical Data | ❌ Paid only |

**For this widget:**
- Updates every 10 minutes = **144 calls/day**
- Well within free limit! ✅

---

## 🔧 Configuration Options

### **Change Update Frequency**

In `weather-widget.js`, find this line:
```javascript
setInterval(fetchWeather, 600000); // 600000ms = 10 minutes
```

**Change to:**
- 5 minutes: `300000`
- 15 minutes: `900000`
- 30 minutes: `1800000`

### **Change Temperature Units**

Currently set to **Celsius** (metric).

To change to **Fahrenheit**:
```javascript
// Find this line:
`${OPENWEATHER_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`

// Change to:
`${OPENWEATHER_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=imperial`
```

Then update the display:
```javascript
// Change °C to °F in the HTML
<div class="weather-temp">${Math.round(main.temp)}°F</div>
```

---

## 🎨 What's New

### **Air Quality Display**
Now shows air quality with color coding:
- 🟢 Green = Good
- 🔵 Cyan = Fair  
- 🟡 Yellow = Moderate
- 🔴 Red = Poor/Very Poor

### **Smarter Health Tips**
Tips now consider:
- Air quality levels
- Temperature extremes
- Weather conditions
- Humidity
- Wind speed

### **Better Weather Icons**
- ☀️ Clear sky (day)
- 🌙 Clear sky (night)
- 🌤️ Few clouds
- ☁️ Cloudy
- 🌧️ Rain
- ⛈️ Thunderstorm
- ❄️ Snow
- 🌫️ Fog/Mist

---

## 🐛 Troubleshooting

### **"API Key Required" Error**
- ✅ Check you added your API key correctly
- ✅ Remove quotes if you copied them
- ✅ Wait 10-15 minutes after creating key

### **"Invalid API Key" Error**
- ✅ Double-check the API key is correct
- ✅ No extra spaces before/after
- ✅ Key should be 32 characters long

### **Weather Not Loading**
1. Check browser console (F12)
2. Look for error messages
3. Verify location permission is enabled
4. Check internet connection

### **Air Quality Not Showing**
- Air quality data may not be available for all locations
- This is normal and won't break the widget
- Other weather data will still display

---

## 📊 API Response Example

```json
{
  "weather": [
    {
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "main": {
    "temp": 24.5,
    "feels_like": 22.3,
    "humidity": 65
  },
  "wind": {
    "speed": 3.5
  },
  "visibility": 10000,
  "name": "Mumbai",
  "sys": {
    "country": "IN"
  }
}
```

---

## 🔒 Security Best Practices

### **For Production:**

1. **Don't commit API key to Git**:
   ```bash
   # Add to .gitignore
   echo "weather-widget.js" >> .gitignore
   ```

2. **Use Environment Variables** (Advanced):
   ```javascript
   const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
   ```

3. **Restrict API Key** (in OpenWeatherMap dashboard):
   - Go to API Keys settings
   - Add domain restrictions
   - Limit to your website domain

---

## 📝 Example Health Tips

Based on conditions:

| Condition | Tip |
|-----------|-----|
| AQI 4-5 | "Air quality is poor. Avoid outdoor exercise!" |
| Thunderstorm | "Thunderstorm! Stay safe indoors!" |
| Rain | "Rainy weather! Perfect for indoor yoga!" |
| Snow | "Snowy day! Dress warmly if going outside!" |
| >35°C | "Very hot! Stay hydrated and avoid peak hours!" |
| 20-28°C | "Perfect weather for outdoor exercise!" |
| <0°C | "Freezing! Limit outdoor exposure!" |

---

## ✅ Checklist

Before deploying:
- [ ] Signed up for OpenWeatherMap account
- [ ] Got API key from dashboard
- [ ] Added API key to `weather-widget.js`
- [ ] Waited 10-15 minutes for activation
- [ ] Tested locally - weather loads
- [ ] Air quality shows (if available)
- [ ] Health tips display correctly
- [ ] Ready to deploy!

---

## 🚀 Deploy to Netlify

Once tested locally:

```bash
git add frontend/dashboard/weather-widget.js
git commit -m "Add OpenWeatherMap API integration"
git push origin main
```

Netlify will auto-deploy in 1-2 minutes!

---

## 📚 Resources

- **OpenWeatherMap Docs**: [https://openweathermap.org/api](https://openweathermap.org/api)
- **Current Weather API**: [https://openweathermap.org/current](https://openweathermap.org/current)
- **Air Pollution API**: [https://openweathermap.org/api/air-pollution](https://openweathermap.org/api/air-pollution)
- **API Dashboard**: [https://home.openweathermap.org/](https://home.openweathermap.org/)

---

## 🎉 You're All Set!

Your weather widget now uses **OpenWeatherMap API** with:
- ✅ Accurate weather data
- ✅ Air quality monitoring
- ✅ Smart health recommendations
- ✅ Professional weather icons
- ✅ Free tier (1,000 calls/day)

**Just add your API key and you're ready to go!** 🚀
