// ================= NEW FEATURES FUNCTIONS =================

// Hydration Tracker - Toggle Glass
function toggleGlass(element) {
    element.classList.toggle('filled');
    updateHydrationStatus();
}

function updateHydrationStatus() {
    const glasses = document.querySelectorAll('.glass');
    const filled = document.querySelectorAll('.glass.filled').length;
    const total = glasses.length;
    const liters = (filled * 0.25).toFixed(2);
    const targetLiters = (total * 0.25).toFixed(2);

    const statusElement = document.querySelector('.hydration-status');
    if (statusElement) {
        statusElement.textContent = `${filled} / ${total} glasses (${liters}L / ${targetLiters}L)`;
    }

    const progressBar = document.querySelector('.hydration-card .progress span');
    if (progressBar) {
        const percentage = (filled / total) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

// Breathing Exercise
let breathingActive = false;
let breathingInterval;

function startBreathing() {
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    const btn = document.getElementById('breathingBtn');

    if (!breathingActive) {
        breathingActive = true;
        btn.textContent = 'Stop Session';
        circle.classList.add('active');

        let phase = 0;
        const phases = ['Breathe In (4s)', 'Hold (7s)', 'Breathe Out (8s)'];
        const durations = [4000, 7000, 8000];

        function nextPhase() {
            text.textContent = phases[phase];
            setTimeout(() => {
                phase = (phase + 1) % 3;
                if (breathingActive) {
                    nextPhase();
                }
            }, durations[phase]);
        }

        nextPhase();
    } else {
        breathingActive = false;
        btn.textContent = 'Start Session';
        circle.classList.remove('active');
        text.textContent = 'Breathe';
    }
}

// BMI Calculator
function calculateBMI() {
    const height = parseFloat(document.getElementById('heightInput').value);
    const weight = parseFloat(document.getElementById('weightInput').value);

    if (!height || !weight || height <= 0 || weight <= 0) {
        alert('Please enter valid height and weight values');
        return;
    }

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    const bmiValueElement = document.querySelector('.bmi-value');
    const bmiStatusElement = document.querySelector('.bmi-status');
    const bmiIndicator = document.querySelector('.bmi-indicator');

    if (bmiValueElement) {
        bmiValueElement.textContent = bmi;
    }

    let status = '';
    let indicatorPosition = 50;

    if (bmi < 18.5) {
        status = 'Underweight';
        indicatorPosition = 15;
    } else if (bmi >= 18.5 && bmi < 25) {
        status = 'Normal Weight';
        indicatorPosition = 45;
    } else if (bmi >= 25 && bmi < 30) {
        status = 'Overweight';
        indicatorPosition = 70;
    } else {
        status = 'Obese';
        indicatorPosition = 90;
    }

    if (bmiStatusElement) {
        bmiStatusElement.textContent = status;
    }

    if (bmiIndicator) {
        bmiIndicator.style.left = `${indicatorPosition}%`;
    }
}

// Health Tips Rotation
const healthTips = [
    {
        icon: '🥗',
        text: 'Eating a balanced breakfast within an hour of waking up helps boost metabolism and maintain energy levels throughout the day.'
    },
    {
        icon: '💧',
        text: 'Drink at least 8 glasses of water daily to stay hydrated, improve skin health, and support vital organ functions.'
    },
    {
        icon: '🏃',
        text: 'Regular physical activity for 30 minutes a day can reduce the risk of chronic diseases and improve mental health.'
    },
    {
        icon: '😴',
        text: 'Quality sleep of 7-9 hours is essential for memory consolidation, immune function, and overall well-being.'
    },
    {
        icon: '🧘',
        text: 'Practice mindfulness or meditation for 10 minutes daily to reduce stress and improve focus and emotional balance.'
    },
    {
        icon: '🥦',
        text: 'Include colorful vegetables in your diet - different colors provide different nutrients and antioxidants.'
    },
    {
        icon: '🚶',
        text: 'Take short walking breaks every hour if you have a sedentary job to improve circulation and reduce health risks.'
    },
    {
        icon: '🌞',
        text: 'Get 15-20 minutes of sunlight exposure daily for vitamin D production and better mood regulation.'
    }
];

let currentTipIndex = 0;

function nextTip() {
    currentTipIndex = (currentTipIndex + 1) % healthTips.length;
    const tip = healthTips[currentTipIndex];

    const tipIcon = document.querySelector('.tip-icon');
    const tipText = document.querySelector('.tip-text');

    if (tipIcon && tipText) {
        // Fade out
        tipIcon.style.opacity = '0';
        tipText.style.opacity = '0';

        setTimeout(() => {
            tipIcon.textContent = tip.icon;
            tipText.textContent = `"${tip.text}"`;

            // Fade in
            tipIcon.style.transition = 'opacity 0.5s ease';
            tipText.style.transition = 'opacity 0.5s ease';
            tipIcon.style.opacity = '1';
            tipText.style.opacity = '1';
        }, 300);
    }
}

// Auto-rotate tips every 30 seconds
setInterval(nextTip, 30000);

// Weather API Integration (placeholder - replace with actual API)
async function fetchWeather() {
    // This would typically call a weather API
    // For now, using placeholder data
    const weatherData = {
        temp: 24,
        condition: 'Partly Cloudy',
        humidity: 65,
        airQuality: 'Good',
        tip: '💡 Perfect weather for outdoor exercise!'
    };

    updateWeatherDisplay(weatherData);
}

function updateWeatherDisplay(data) {
    const tempElement = document.querySelector('.weather-temp');
    const descElement = document.querySelector('.weather-desc');
    const tipElement = document.querySelector('.weather-tip');

    if (tempElement) tempElement.textContent = `${data.temp}°C`;
    if (descElement) descElement.textContent = data.condition;
    if (tipElement) tipElement.textContent = data.tip;
}

// Initialize weather on page load
fetchWeather();

// Medication Checkbox Handler
document.addEventListener('DOMContentLoaded', () => {
    const medicationCheckboxes = document.querySelectorAll('.medication-item input[type="checkbox"]');

    medicationCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const item = this.closest('.medication-item');
            if (this.checked) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        });
    });
});

// Exercise Timer (placeholder for future implementation)
function startExercise(exerciseName) {
    alert(`Starting ${exerciseName}! Timer functionality coming soon.`);
}

// Appointment Reminder
function setReminder(appointmentId) {
    alert('Reminder set! You will be notified 1 hour before the appointment.');
}

// Add Medication Modal (placeholder)
document.addEventListener('DOMContentLoaded', () => {
    const addMedBtn = document.querySelector('.add-medication-btn');
    if (addMedBtn) {
        addMedBtn.addEventListener('click', () => {
            alert('Add Medication feature coming soon! You will be able to add custom medications with dosage and timing.');
        });
    }

    const addApptBtn = document.querySelector('.add-appointment-btn');
    if (addApptBtn) {
        addApptBtn.addEventListener('click', () => {
            alert('Schedule Appointment feature coming soon! You will be able to book appointments with healthcare providers.');
        });
    }
});

console.log('✅ New dashboard features loaded successfully!');
