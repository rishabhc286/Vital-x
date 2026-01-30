// ================= CHARTS INITIALIZATION =================

// Heart Rate Chart
const heartCtx = document.getElementById("heartChart");
if (heartCtx) {
    new Chart(heartCtx, {
        type: "line",
        data: {
            labels: ["6am", "8am", "10am", "12pm", "2pm", "4pm", "6pm", "8pm"],
            datasets: [{
                data: [65, 78, 85, 72, 88, 76, 82, 68],
                borderColor: "#2dd4bf",
                backgroundColor: "rgba(45,212,191,0.15)",
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#2dd4bf"
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
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
                backgroundColor: "rgba(34,211,238,0.15)",
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: "#22d3ee"
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
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
                    backgroundColor: "rgba(239,68,68,0.1)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
                },
                {
                    label: "Diastolic",
                    data: [80, 78, 82, 79, 81, 80, 78],
                    borderColor: "#2dd4bf",
                    backgroundColor: "rgba(45,212,191,0.1)",
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2
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
                label: "Hours",
                data: [7.5, 8.0, 7.2, 7.8, 6.5, 8.5, 7.0],
                backgroundColor: "rgba(45,212,191,0.6)",
                borderColor: "#2dd4bf",
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    grid: { color: "rgba(255,255,255,0.05)" },
                    ticks: { color: "#9ca3af" },
                    beginAtZero: true
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

// ================= SIDEBAR TOGGLE =================
function toggleSidebar() {
    document.body.classList.toggle("sidebar-collapsed");
}

// ================= GREETING TEXT =================
async function updateGreeting() {
    const greetingText = document.getElementById("greetingText");
    if (!greetingText) return;

    const hour = new Date().getHours();
    let greeting = "Welcome back";

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    // Get user data from Firebase
    try {
        const user = auth.currentUser;
        if (user) {
            const profileResult = await UserService.getUserProfile(user.uid);

            if (profileResult.success && profileResult.data) {
                const userData = profileResult.data;
                const userName = userData.displayName || userData.email.split('@')[0];

                greetingText.textContent = `${greeting}, ${userName}`;

                // Update dashboard with health data if available
                if (userData.healthDetails) {
                    updateDashboardWithHealthData(userData.healthDetails);
                }
            } else {
                // Fallback to email
                const userName = user.email.split('@')[0];
                greetingText.textContent = `${greeting}, ${userName}`;
            }
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to default
        greetingText.textContent = `${greeting}`;
    }
}

// Update dashboard with health data
function updateDashboardWithHealthData(healthDetails) {
    // Update BMI if available
    if (healthDetails.bmi) {
        const bmiElement = document.querySelector('.bmi-value');
        if (bmiElement) {
            bmiElement.textContent = healthDetails.bmi;
        }
    }

    // Update age display if available
    if (healthDetails.age) {
        const ageElement = document.querySelector('.age-value');
        if (ageElement) {
            ageElement.textContent = `${healthDetails.age} years`;
        }
    }

    // Update avatar if available
    if (healthDetails.avatarEmoji) {
        const avatarElements = document.querySelectorAll('.user-avatar');
        avatarElements.forEach(el => {
            el.textContent = healthDetails.avatarEmoji;
        });
    }

    console.log('✅ Dashboard updated with health data');
}

// Initialize greeting on page load
auth.onAuthStateChanged((user) => {
    if (user) {
        updateGreeting();
    } else {
        window.location.href = '../auth/login.html';
    }
});

// ================= ANIMATIONS =================
// Animate cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all cards
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        cardObserver.observe(card);
    });
});

// ================= REAL-TIME UPDATES =================
// Simulate real-time health data updates
function updateHealthMetrics() {
    // This would typically fetch from an API
    // For now, we'll just add visual feedback
    const healthScore = document.querySelector(".score-value");
    if (healthScore) {
        // Subtle pulse animation
        healthScore.style.animation = "pulse 2s ease-in-out infinite";
    }
}

// Initialize updates
updateHealthMetrics();
