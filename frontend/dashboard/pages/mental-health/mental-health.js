// ================= MENTAL HEALTH PAGE JAVASCRIPT =================

// State management
let checkInData = {
    mood: null,
    energy: 5,
    sleep: 5,
    triggers: []
};

let wellnessHistory = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadWellnessData();
    initializeChart();
    updateWellnessScore();
    loadQuickStats();
});

// ================= MOOD SELECTION =================
function selectMood(mood) {
    checkInData.mood = mood;
    
    // Update UI
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    const selectedBtn = document.querySelector(`[data-mood="${mood}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('selected');
    }
}

// ================= SLIDER UPDATES =================
function updateSliderValue(type, value) {
    if (type === 'energy') {
        checkInData.energy = parseInt(value);
        document.getElementById('energyValue').textContent = value;
    } else if (type === 'sleep') {
        checkInData.sleep = parseInt(value);
        document.getElementById('sleepValue').textContent = value;
    }
}

// ================= TRIGGER SELECTION =================
function toggleTrigger(button, trigger) {
    button.classList.toggle('selected');
    
    const index = checkInData.triggers.indexOf(trigger);
    if (index > -1) {
        checkInData.triggers.splice(index, 1);
    } else {
        checkInData.triggers.push(trigger);
    }
}

// ================= SUBMIT CHECK-IN =================
function submitCheckIn() {
    // Validate
    if (!checkInData.mood) {
        alert('Please select how you feel today');
        return;
    }
    
    // Create check-in entry
    const entry = {
        date: new Date().toISOString(),
        mood: checkInData.mood,
        energy: checkInData.energy,
        sleep: checkInData.sleep,
        triggers: [...checkInData.triggers],
        timestamp: Date.now()
    };
    
    // Save to history
    wellnessHistory.push(entry);
    localStorage.setItem('mentalHealthHistory', JSON.stringify(wellnessHistory));
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    resetCheckInForm();
    
    // Update displays
    updateWellnessScore();
    loadQuickStats();
    updateChart();
}

function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'success-toast';
    message.innerHTML = `
        <span style="font-size: 24px;">✓</span>
        <span>Check-in saved successfully!</span>
    `;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

function resetCheckInForm() {
    checkInData = {
        mood: null,
        energy: 5,
        sleep: 5,
        triggers: []
    };
    
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.trigger-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('energySlider').value = 5;
    document.getElementById('sleepSlider').value = 5;
    document.getElementById('energyValue').textContent = '5';
    document.getElementById('sleepValue').textContent = '5';
}

// ================= WELLNESS SCORE CALCULATION =================
function updateWellnessScore() {
    if (wellnessHistory.length === 0) {
        document.getElementById('wellnessScore').textContent = '--';
        document.getElementById('wellnessStatus').textContent = 'No data yet';
        return;
    }
    
    // Get last 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentEntries = wellnessHistory.filter(entry => entry.timestamp > sevenDaysAgo);
    
    if (recentEntries.length === 0) {
        document.getElementById('wellnessScore').textContent = '--';
        document.getElementById('wellnessStatus').textContent = 'No recent data';
        return;
    }
    
    // Calculate score based on mood, energy, sleep, and consistency
    const moodScore = calculateMoodScore(recentEntries);
    const energyAvg = recentEntries.reduce((sum, e) => sum + e.energy, 0) / recentEntries.length;
    const sleepAvg = recentEntries.reduce((sum, e) => sum + e.sleep, 0) / recentEntries.length;
    const consistencyScore = (recentEntries.length / 7) * 100;
    
    // Weighted average
    const totalScore = Math.round(
        (moodScore * 0.4) + 
        (energyAvg * 10 * 0.3) + 
        (sleepAvg * 10 * 0.2) + 
        (consistencyScore * 0.1)
    );
    
    // Update UI
    document.getElementById('wellnessScore').textContent = totalScore;
    
    let status, statusClass;
    if (totalScore >= 80) {
        status = 'Balanced';
        statusClass = 'balanced';
    } else if (totalScore >= 60) {
        status = 'Calm';
        statusClass = 'calm';
    } else {
        status = 'Overloaded';
        statusClass = 'overloaded';
    }
    
    const statusElement = document.getElementById('wellnessStatus');
    statusElement.textContent = status;
    statusElement.className = `score-label ${statusClass}`;
    
    // Animate circle
    const circle = document.getElementById('scoreCircle');
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (totalScore / 100) * circumference;
    
    if (circle) {
        circle.style.strokeDashoffset = offset;
    }
}

function calculateMoodScore(entries) {
    const moodValues = {
        'happy': 100,
        'calm': 80,
        'stressed': 50,
        'anxious': 40,
        'low': 30
    };
    
    const total = entries.reduce((sum, e) => sum + (moodValues[e.mood] || 50), 0);
    return total / entries.length;
}

// ================= QUICK STATS =================
function loadQuickStats() {
    if (wellnessHistory.length === 0) {
        document.getElementById('avgMood').textContent = '--';
        document.getElementById('avgEnergy').textContent = '--';
        document.getElementById('avgSleep').textContent = '--';
        document.getElementById('checkInCount').textContent = '0';
        return;
    }
    
    // Get last 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentEntries = wellnessHistory.filter(entry => entry.timestamp > sevenDaysAgo);
    
    if (recentEntries.length === 0) {
        document.getElementById('avgMood').textContent = '--';
        document.getElementById('avgEnergy').textContent = '--';
        document.getElementById('avgSleep').textContent = '--';
        document.getElementById('checkInCount').textContent = '0';
        return;
    }
    
    // Calculate averages
    const moodEmojis = {
        'happy': '😊',
        'calm': '😌',
        'stressed': '😰',
        'anxious': '😟',
        'low': '😔'
    };
    
    const mostCommonMood = getMostCommonMood(recentEntries);
    const avgEnergy = (recentEntries.reduce((sum, e) => sum + e.energy, 0) / recentEntries.length).toFixed(1);
    const avgSleep = (recentEntries.reduce((sum, e) => sum + e.sleep, 0) / recentEntries.length).toFixed(1);
    
    document.getElementById('avgMood').textContent = moodEmojis[mostCommonMood] || '--';
    document.getElementById('avgEnergy').textContent = `${avgEnergy}/10`;
    document.getElementById('avgSleep').textContent = `${avgSleep}/10`;
    document.getElementById('checkInCount').textContent = recentEntries.length;
}

function getMostCommonMood(entries) {
    const moodCounts = {};
    entries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    return Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b
    );
}

// ================= CHART =================
let moodChart;

function initializeChart() {
    const ctx = document.getElementById('moodChart');
    if (!ctx) return;
    
    moodChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Mood Score',
                    data: [],
                    borderColor: 'rgb(34, 197, 94)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Energy',
                    data: [],
                    borderColor: 'rgb(56, 189, 248)',
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#e5e7eb'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    ticks: {
                        color: '#9ca3af'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#9ca3af'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
    
    updateChart();
}

function updateChart() {
    if (!moodChart) return;
    
    // Get last 7 days
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const recentEntries = wellnessHistory.filter(entry => entry.timestamp > sevenDaysAgo);
    
    const moodValues = {
        'happy': 10,
        'calm': 8,
        'stressed': 5,
        'anxious': 4,
        'low': 3
    };
    
    const labels = recentEntries.map(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const moodData = recentEntries.map(e => moodValues[e.mood] || 5);
    const energyData = recentEntries.map(e => e.energy);
    
    moodChart.data.labels = labels;
    moodChart.data.datasets[0].data = moodData;
    moodChart.data.datasets[1].data = energyData;
    moodChart.update();
}

// ================= ACTIVITIES =================
function startActivity(type) {
    const activities = {
        'breathing': {
            title: '🌬️ Breathing Exercise',
            description: 'Follow the guided breathing pattern for 5 minutes.',
            instructions: [
                'Find a comfortable position',
                'Breathe in slowly for 4 seconds',
                'Hold for 4 seconds',
                'Breathe out for 6 seconds',
                'Repeat for 5 minutes'
            ]
        },
        'focus': {
            title: '🎯 Focus Tips',
            description: 'Improve your concentration with these techniques.',
            instructions: [
                'Remove distractions from your workspace',
                'Use the Pomodoro technique (25 min work, 5 min break)',
                'Take regular breaks to avoid burnout',
                'Stay hydrated and maintain good posture'
            ]
        },
        'sleep': {
            title: '😴 Sleep Improvement',
            description: 'Better sleep habits for quality rest.',
            instructions: [
                'Maintain a consistent sleep schedule',
                'Avoid screens 1 hour before bed',
                'Keep your bedroom cool and dark',
                'Avoid caffeine after 2 PM',
                'Practice relaxation before sleep'
            ]
        },
        'detox': {
            title: '📱 Digital Detox',
            description: 'Reduce screen time for better mental health.',
            instructions: [
                'Set specific times to check social media',
                'Turn off non-essential notifications',
                'Use screen time limits on your devices',
                'Replace scrolling with reading or walking',
                'Practice being present in the moment'
            ]
        }
    };
    
    const activity = activities[type];
    if (!activity) return;
    
    alert(`${activity.title}\n\n${activity.description}\n\n${activity.instructions.join('\n')}`);
}

// ================= VIEW HISTORY =================
function viewHistory() {
    if (wellnessHistory.length === 0) {
        alert('No check-in history yet. Complete your first check-in to start tracking!');
        return;
    }
    
    let historyHTML = 'Mental Health History\n\n';
    wellnessHistory.slice(-10).reverse().forEach(entry => {
        const date = new Date(entry.date).toLocaleDateString();
        historyHTML += `${date}: ${entry.mood} | Energy: ${entry.energy}/10 | Sleep: ${entry.sleep}/10\n`;
    });
    
    alert(historyHTML);
}

// ================= DATA PERSISTENCE =================
function loadWellnessData() {
    const saved = localStorage.getItem('mentalHealthHistory');
    if (saved) {
        wellnessHistory = JSON.parse(saved);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
