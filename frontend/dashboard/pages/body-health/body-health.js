// Health Timeline & Risk Evolution JavaScript
// Shows health evolution over time based on lifestyle decisions

let healthDebtChart, consistencyChart, riskProgressionChart;
let futureContinueChart, futureImproveChart, futureOptimalChart;

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    initializeCharts();
    switchTimeline('past'); // Default view
});

// Switch between timeline views
function switchTimeline(period) {
    // Update button states
    document.querySelectorAll('.timeline-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-period') === period) {
            btn.classList.add('active');
        }
    });

    // Update view visibility
    document.querySelectorAll('.timeline-view').forEach(view => {
        view.classList.remove('active');
    });

    const viewMap = {
        'past': 'pastView',
        'today': 'todayView',
        'future': 'futureView'
    };

    const targetView = document.getElementById(viewMap[period]);
    if (targetView) {
        targetView.classList.add('active');
    }

    // Initialize future charts if switching to future view
    if (period === 'future' && !futureContinueChart) {
        initializeFutureCharts();
    }
}

// Switch between future scenarios
function switchScenario(scenario) {
    // Update tab states
    document.querySelectorAll('.scenario-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update scenario content
    document.querySelectorAll('.scenario-content').forEach(content => {
        content.classList.remove('active');
    });

    const contentMap = {
        'continue': 'scenarioContinue',
        'improve': 'scenarioImprove',
        'optimal': 'scenarioOptimal'
    };

    const targetContent = document.getElementById(contentMap[scenario]);
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// Initialize all charts
function initializeCharts() {
    initializePastCharts();
}

// Initialize past view charts
function initializePastCharts() {
    // Health Debt Evolution Chart
    const healthDebtCtx = document.getElementById('healthDebtChart');
    if (healthDebtCtx) {
        healthDebtChart = new Chart(healthDebtCtx, {
            type: 'line',
            data: {
                labels: generateDayLabels(30),
                datasets: [{
                    label: 'Health Debt Score',
                    data: generateHealthDebtData(),
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }, {
                    label: 'Target (20 points)',
                    data: Array(30).fill(20),
                    borderColor: '#22c55e',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#e5e7eb' }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 40,
                        ticks: { color: '#9ca3af' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#9ca3af' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    // Lifestyle Consistency Chart
    const consistencyCtx = document.getElementById('consistencyChart');
    if (consistencyCtx) {
        consistencyChart = new Chart(consistencyCtx, {
            type: 'line',
            data: {
                labels: generateDayLabels(30),
                datasets: [
                    {
                        label: 'Sleep',
                        data: generateConsistencyData(92, 5),
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Diet',
                        data: generateConsistencyData(80, 8),
                        borderColor: '#22c55e',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Exercise',
                        data: generateConsistencyData(65, 12),
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Stress Management',
                        data: generateConsistencyData(75, 10),
                        borderColor: '#2dd4bf',
                        backgroundColor: 'rgba(45, 212, 191, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#e5e7eb' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#9ca3af' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#9ca3af' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    // Risk Progression Chart
    const riskCtx = document.getElementById('riskProgressionChart');
    if (riskCtx) {
        riskProgressionChart = new Chart(riskCtx, {
            type: 'line',
            data: {
                labels: generateDayLabels(30),
                datasets: [{
                    label: 'Overall Risk Level (%)',
                    data: generateRiskProgressionData(),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#e5e7eb' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: '#9ca3af' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                        ticks: { color: '#9ca3af' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }
}

// Initialize future scenario charts
function initializeFutureCharts() {
    const futureLabels = ['Today', 'Week 2', 'Week 4', 'Week 6', 'Week 8', 'Week 10', 'Week 12'];

    // Continue Current Routine
    const continueCt = document.getElementById('futureContinueChart');
    if (continueCtx) {
        futureContinueChart = new Chart(continueCtx, {
            type: 'line',
            data: {
                labels: futureLabels,
                datasets: [{
                    label: 'Health Debt Score',
                    data: [18, 19, 20, 21, 21, 22, 22],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: getFutureChartOptions()
        });
    }

    // Improve Sleep & Diet
    const improveCtx = document.getElementById('futureImproveChart');
    if (improveCtx) {
        futureImproveChart = new Chart(improveCtx, {
            type: 'line',
            data: {
                labels: futureLabels,
                datasets: [{
                    label: 'Health Debt Score',
                    data: [18, 15, 13, 11, 10, 9, 8],
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: getFutureChartOptions()
        });
    }

    // Optimal Lifestyle
    const optimalCtx = document.getElementById('futureOptimalChart');
    if (optimalCtx) {
        futureOptimalChart = new Chart(optimalCtx, {
            type: 'line',
            data: {
                labels: futureLabels,
                datasets: [{
                    label: 'Health Debt Score',
                    data: [18, 13, 10, 7, 5, 4, 3],
                    borderColor: '#2dd4bf',
                    backgroundColor: 'rgba(45, 212, 191, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: getFutureChartOptions()
        });
    }
}

// Get future chart options
function getFutureChartOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 30,
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            x: {
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    };
}

// Generate day labels
function generateDayLabels(days) {
    const labels = [];
    for (let i = days; i > 0; i--) {
        if (i === 1) {
            labels.push('Today');
        } else {
            labels.push(`Day ${days - i + 1}`);
        }
    }
    return labels;
}

// Generate Health Debt data (declining trend)
function generateHealthDebtData() {
    const data = [];
    let value = 35;
    for (let i = 0; i < 30; i++) {
        value = value - (Math.random() * 1.5) + (Math.random() * 0.5);
        value = Math.max(12, Math.min(40, value));
        data.push(Math.round(value));
    }
    return data;
}

// Generate consistency data
function generateConsistencyData(average, variance) {
    const data = [];
    for (let i = 0; i < 30; i++) {
        const value = average + (Math.random() - 0.5) * variance;
        data.push(Math.max(0, Math.min(100, Math.round(value))));
    }
    return data;
}

// Generate risk progression data (declining trend)
function generateRiskProgressionData() {
    const data = [];
    let value = 40;
    for (let i = 0; i < 30; i++) {
        value = value - (Math.random() * 1.2) + (Math.random() * 0.3);
        value = Math.max(20, Math.min(50, value));
        data.push(Math.round(value));
    }
    return data;
}
