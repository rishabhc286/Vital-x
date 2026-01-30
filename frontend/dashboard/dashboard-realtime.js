/**
 * Dashboard Real-Time Data Integration
 * Loads and displays user health data from Firebase
 */

// Global variables
let currentUser = null;
let userProfile = null;
let dashboardData = null;

// ================= AUTHENTICATION CHECK =================
async function checkAuthAndLoadData() {
    try {
        // Check if user is authenticated
        currentUser = await AuthService.checkAuth();

        if (!currentUser) {
            console.log('❌ No user authenticated, redirecting to login...');
            window.location.href = '../auth/login.html';
            return;
        }

        console.log('✅ User authenticated:', currentUser.uid);

        // Load user data
        await loadUserProfile();
        await loadDashboardData();

        // Update UI with user data
        updateDashboardUI();

    } catch (error) {
        console.error('❌ Error in authentication check:', error);
        window.location.href = '../auth/login.html';
    }
}

// ================= LOAD USER PROFILE =================
async function loadUserProfile() {
    try {
        const result = await UserService.getUserProfile(currentUser.uid);

        if (result.success) {
            userProfile = result.data;
            console.log('✅ User profile loaded:', userProfile);

            // Update greeting with user's name
            updateGreeting();
        } else {
            console.warn('⚠️ Could not load user profile');
        }
    } catch (error) {
        console.error('❌ Error loading user profile:', error);
    }
}

// ================= LOAD DASHBOARD DATA =================
async function loadDashboardData() {
    try {
        const result = await HealthDataService.getDashboardData(currentUser.uid);

        if (result.success) {
            dashboardData = result.data;
            console.log('✅ Dashboard data loaded:', dashboardData);
        } else {
            console.warn('⚠️ Could not load dashboard data');
            dashboardData = {
                timeline: null,
                todayCalories: 0,
                mentalHealth: null
            };
        }
    } catch (error) {
        console.error('❌ Error loading dashboard data:', error);
        dashboardData = {
            timeline: null,
            todayCalories: 0,
            mentalHealth: null
        };
    }
}

// ================= UPDATE DASHBOARD UI =================
function updateDashboardUI() {
    // Update Health Debt Score
    if (dashboardData.timeline) {
        const healthDebtScore = dashboardData.timeline.healthDebtScore || 12;
        const riskTrend = dashboardData.timeline.riskTrend || 'improving';
        const lifestyleScore = dashboardData.timeline.lifestyleScore || 92;

        // Update Health Stability Score
        const scoreValue = document.querySelector('.score-value');
        if (scoreValue) {
            scoreValue.textContent = lifestyleScore;
        }

        // Update Health Debt Score
        const debtScoreElement = document.querySelector('.health-debt-card h3');
        if (debtScoreElement) {
            debtScoreElement.innerHTML = `${healthDebtScore} <span>points</span>`;
        }

        // Update Risk Trend
        const riskTrendElement = document.querySelector('.risk-trend-card h3');
        if (riskTrendElement) {
            riskTrendElement.textContent = riskTrend.charAt(0).toUpperCase() + riskTrend.slice(1);
        }

        // Update metrics if available
        if (dashboardData.timeline.metrics) {
            const metrics = dashboardData.timeline.metrics;

            // Update Sleep Quality
            const sleepElement = document.querySelector('.stat-card:has(.icon:contains("🌙")) h3');
            if (sleepElement && metrics.sleep) {
                sleepElement.innerHTML = `${metrics.sleep} <span>hrs</span>`;
            }

            // Update Stress Level
            const stressElement = document.querySelector('.stat-card:has(.icon:contains("🧠")) h3');
            if (stressElement && metrics.stress !== undefined) {
                const stressLevel = metrics.stress < 30 ? 'Low' : metrics.stress < 70 ? 'Medium' : 'High';
                stressElement.textContent = stressLevel;
            }
        }
    }

    // Update Calories
    if (dashboardData.todayCalories) {
        const caloriesElement = document.querySelector('.stat-card:has(.icon:contains("🔥")) h3');
        if (caloriesElement) {
            caloriesElement.textContent = dashboardData.todayCalories.toLocaleString();
        }
    }

    // Update Mental Health Score
    if (dashboardData.mentalHealth) {
        const wellnessScore = dashboardData.mentalHealth.wellnessScore || 0;
        // You can add a mental health indicator to the dashboard if needed
        console.log('Mental Health Score:', wellnessScore);
    }

    // Update user-specific data
    if (userProfile && userProfile.healthDetails) {
        const healthDetails = userProfile.healthDetails;

        // Update BMI if available
        if (healthDetails.bmi) {
            const bmiValueElement = document.querySelector('.bmi-value');
            if (bmiValueElement) {
                bmiValueElement.textContent = healthDetails.bmi;
            }
        }
    }
}

// ================= GREETING TEXT =================
function updateGreeting() {
    const greetingElement = document.getElementById('greetingText');
    if (!greetingElement) return;

    const hour = new Date().getHours();
    let greeting = 'Welcome back';

    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    // Use user's name if available
    let userName = 'User';
    if (userProfile) {
        userName = userProfile.firstName || userProfile.displayName || 'User';
    } else if (currentUser) {
        userName = currentUser.displayName || 'User';
    }

    greetingElement.textContent = `${greeting}, ${userName}`;
}

// ================= SAVE HYDRATION DATA =================
async function toggleGlass(element) {
    element.classList.toggle('filled');

    // Count filled glasses
    const filledGlasses = document.querySelectorAll('.glass.filled').length;
    const totalGlasses = 8;
    const liters = (filledGlasses * 0.25).toFixed(2);

    // Update display
    const statusElement = document.querySelector('.hydration-status');
    if (statusElement) {
        statusElement.textContent = `${filledGlasses} / ${totalGlasses} glasses (${liters}L / 2L)`;
    }

    const progressBar = document.querySelector('.hydration-card .progress span');
    if (progressBar) {
        const percentage = (filledGlasses / totalGlasses) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    // Save to database
    if (currentUser) {
        const today = new Date().toISOString().split('T')[0];
        await HealthDataService.saveTimelineEntry(currentUser.uid, {
            date: today,
            healthDebtScore: dashboardData?.timeline?.healthDebtScore || 0,
            lifestyleScore: dashboardData?.timeline?.lifestyleScore || 0,
            riskTrend: dashboardData?.timeline?.riskTrend || 'stable',
            hydration: filledGlasses,
            notes: `Hydration updated: ${filledGlasses} glasses`
        });
    }
}

// ================= BMI CALCULATOR =================
function calculateBMI() {
    const height = parseFloat(document.getElementById('heightInput').value);
    const weight = parseFloat(document.getElementById('weightInput').value);

    if (!height || !weight) {
        alert('Please enter both height and weight');
        return;
    }

    const bmi = UserService.calculateBMI(height, weight);
    const bmiValueElement = document.querySelector('.bmi-value');
    const bmiStatusElement = document.querySelector('.bmi-status');
    const bmiIndicator = document.querySelector('.bmi-indicator');

    if (bmiValueElement) {
        bmiValueElement.textContent = bmi;
    }

    let status = '';
    let position = 0;

    if (bmi < 18.5) {
        status = 'Underweight';
        position = 15;
    } else if (bmi < 25) {
        status = 'Normal Weight';
        position = 45;
    } else if (bmi < 30) {
        status = 'Overweight';
        position = 70;
    } else {
        status = 'Obese';
        position = 90;
    }

    if (bmiStatusElement) {
        bmiStatusElement.textContent = status;
    }

    if (bmiIndicator) {
        bmiIndicator.style.left = `${position}%`;
    }

    // Save to user profile
    if (currentUser && userProfile) {
        UserService.saveHealthDetails(currentUser.uid, {
            ...userProfile.healthDetails,
            height: height,
            weight: weight,
            bmi: bmi
        });
    }
}

// ================= HEALTH TIPS =================
const healthTips = [
    { icon: '🥗', text: 'Eating a balanced breakfast within an hour of waking up helps boost metabolism and maintain energy levels throughout the day.' },
    { icon: '💧', text: 'Drinking water first thing in the morning helps kickstart your metabolism and flush out toxins.' },
    { icon: '🏃', text: 'Just 30 minutes of moderate exercise daily can significantly reduce the risk of chronic diseases.' },
    { icon: '🌙', text: 'Getting 7-9 hours of quality sleep is crucial for physical recovery and mental health.' },
    { icon: '🧘', text: 'Practicing mindfulness or meditation for 10 minutes daily can reduce stress and improve focus.' },
    { icon: '🥦', text: 'Eating a variety of colorful vegetables ensures you get a wide range of essential nutrients.' },
    { icon: '🚶', text: 'Taking short walking breaks every hour can improve circulation and reduce sedentary behavior.' },
    { icon: '😊', text: 'Social connections and maintaining relationships are as important for health as diet and exercise.' }
];

let currentTipIndex = 0;

function nextTip() {
    currentTipIndex = (currentTipIndex + 1) % healthTips.length;
    const tip = healthTips[currentTipIndex];

    const tipIcon = document.querySelector('.tip-icon');
    const tipText = document.querySelector('.tip-text');

    if (tipIcon) tipIcon.textContent = tip.icon;
    if (tipText) tipText.textContent = `"${tip.text}"`;
}

// ================= BREATHING EXERCISE =================
let breathingActive = false;
let breathingInterval = null;

function startBreathing() {
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    const btn = document.getElementById('breathingBtn');

    if (breathingActive) {
        // Stop breathing exercise
        breathingActive = false;
        clearInterval(breathingInterval);
        circle.style.transform = 'scale(1)';
        text.textContent = 'Breathe';
        btn.textContent = 'Start Session';
        return;
    }

    // Start breathing exercise
    breathingActive = true;
    btn.textContent = 'Stop Session';

    let phase = 0; // 0: inhale, 1: hold, 2: exhale, 3: hold
    const phases = [
        { duration: 4000, text: 'Inhale', scale: 1.5 },
        { duration: 7000, text: 'Hold', scale: 1.5 },
        { duration: 8000, text: 'Exhale', scale: 1 },
        { duration: 2000, text: 'Rest', scale: 1 }
    ];

    function breathingCycle() {
        const currentPhase = phases[phase];
        text.textContent = currentPhase.text;
        circle.style.transform = `scale(${currentPhase.scale})`;
        circle.style.transition = `transform ${currentPhase.duration}ms ease-in-out`;

        setTimeout(() => {
            if (breathingActive) {
                phase = (phase + 1) % phases.length;
                breathingCycle();
            }
        }, currentPhase.duration);
    }

    breathingCycle();
}

// ================= SIDEBAR TOGGLE =================
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// ================= INITIALIZE ON PAGE LOAD =================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔵 Dashboard loading...');

    // Check authentication and load data
    await checkAuthAndLoadData();

    // Initialize charts (keep existing chart code)
    initializeCharts();

    // Add animations
    addAnimations();

    console.log('✅ Dashboard loaded successfully');
});

// ================= CHARTS INITIALIZATION =================
function initializeCharts() {
    // Heart Rate Chart
    const heartCtx = document.getElementById("heartChart");
    if (heartCtx) {
        new Chart(heartCtx, {
            type: "line",
            data: {
                labels: ["6am", "9am", "12pm", "3pm", "6pm", "9pm"],
                datasets: [{
                    data: [72, 75, 78, 82, 76, 74],
                    borderColor: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "#9ca3af" }
                    },
                    x: {
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "#9ca3af" }
                    }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    // Steps Chart
    const stepsCtx = document.getElementById("stepsChart");
    if (stepsCtx) {
        new Chart(stepsCtx, {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    data: [8200, 12000, 9500, 11000, 7800, 14500, 7200],
                    borderColor: "#22d3ee",
                    backgroundColor: "rgba(34, 211, 238, 0.1)",
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "#9ca3af" }
                    },
                    x: {
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "#9ca3af" }
                    }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    // Blood Pressure Chart
    const bpCtx = document.getElementById("bpChart");
    if (bpCtx) {
        new Chart(bpCtx, {
            type: "line",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                    {
                        label: "Systolic",
                        data: [120, 118, 122, 119, 121, 120, 118],
                        borderColor: "#ef4444",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: "Diastolic",
                        data: [80, 78, 82, 79, 81, 80, 78],
                        borderColor: "#22d3ee",
                        backgroundColor: "rgba(34, 211, 238, 0.1)",
                        borderWidth: 2,
                        tension: 0.4
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: "#9ca3af" }
                    }
                },
                scales: {
                    y: {
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "#9ca3af" }
                    },
                    x: {
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "#9ca3af" }
                    }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }

    // Sleep Quality Chart
    const sleepCtx = document.getElementById("sleepChart");
    if (sleepCtx) {
        new Chart(sleepCtx, {
            type: "bar",
            data: {
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [{
                    data: [7.5, 6.8, 7.2, 6.5, 7.8, 8.2, 7.0],
                    backgroundColor: "#8b5cf6",
                    borderRadius: 8
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "#9ca3af" }
                    },
                    x: {
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "#9ca3af" }
                    }
                },
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
}

// ================= ANIMATIONS =================
function addAnimations() {
    // Fade in cards on scroll
    const cards = document.querySelectorAll('.card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    cards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        cardObserver.observe(card);
    });
}

// Make functions available globally
window.toggleGlass = toggleGlass;
window.calculateBMI = calculateBMI;
window.nextTip = nextTip;
window.startBreathing = startBreathing;
window.toggleSidebar = toggleSidebar;

console.log('💚 Dashboard Real-Time Integration loaded');
