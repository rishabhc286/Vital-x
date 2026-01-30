/**
 * Women's Health (Menstruation) - Real-Time Database Integration
 * Tracks menstruation cycles, symptoms, and predictions with Firebase
 */

let currentUser = null;
let menstruationHistory = [];
let currentCycleData = null;
let todaySymptoms = {};
let todayFlow = null;

// ================= AUTHENTICATION & DATA LOADING =================
async function checkAuthAndLoadData() {
    try {
        currentUser = await AuthService.checkAuth();

        if (!currentUser) {
            window.location.href = '../../../auth/login.html';
            return;
        }

        console.log('✅ User authenticated:', currentUser.uid);
        await loadMenstruationData();
        updateUI();
        initializeCalendar();
        initializeChart();

    } catch (error) {
        console.error('❌ Error loading data:', error);
        window.location.href = '../../../auth/login.html';
    }
}

// ================= LOAD MENSTRUATION DATA =================
async function loadMenstruationData() {
    try {
        const result = await HealthDataService.getMenstruationHistory(currentUser.uid, 12);

        if (result.success) {
            menstruationHistory = result.data;
            console.log('✅ Menstruation history loaded:', menstruationHistory.length, 'cycles');

            if (menstruationHistory.length > 0) {
                currentCycleData = menstruationHistory[0];
            }
        } else {
            console.warn('⚠️ No menstruation history found');
            menstruationHistory = [];
        }
    } catch (error) {
        console.error('❌ Error loading menstruation data:', error);
        menstruationHistory = [];
    }
}

// ================= UPDATE UI =================
function updateUI() {
    if (currentCycleData) {
        // Update stats
        const cycleDay = calculateCycleDay(currentCycleData.lastPeriodDate);
        document.getElementById('cycleDay').textContent = `Day ${cycleDay}`;
        document.getElementById('cycleLength').textContent = `${currentCycleData.cycleLength || 28} days`;
        document.getElementById('periodDuration').textContent = `${currentCycleData.periodDuration || 5} days`;

        // Calculate next period
        const nextPeriodDays = (currentCycleData.cycleLength || 28) - cycleDay;
        document.getElementById('nextPeriod').textContent = `In ${nextPeriodDays} days`;

        // Update cycle info
        const lastPeriodDate = new Date(currentCycleData.lastPeriodDate);
        document.getElementById('lastPeriodStart').textContent = lastPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        // Calculate averages
        if (menstruationHistory.length > 1) {
            const avgCycle = menstruationHistory.reduce((sum, cycle) => sum + (cycle.cycleLength || 28), 0) / menstruationHistory.length;
            const avgPeriod = menstruationHistory.reduce((sum, cycle) => sum + (cycle.periodDuration || 5), 0) / menstruationHistory.length;

            document.getElementById('avgCycle').textContent = `${Math.round(avgCycle)} days`;
            document.getElementById('avgPeriod').textContent = `${Math.round(avgPeriod)} days`;
        }

        // Update predictions
        const nextPeriodDate = new Date(lastPeriodDate);
        nextPeriodDate.setDate(nextPeriodDate.getDate() + (currentCycleData.cycleLength || 28));
        document.getElementById('nextPeriodDate').textContent = nextPeriodDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const ovulationDate = new Date(lastPeriodDate);
        ovulationDate.setDate(ovulationDate.getDate() + 14);
        document.getElementById('nextOvulation').textContent = ovulationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

        const fertileStart = new Date(lastPeriodDate);
        fertileStart.setDate(fertileStart.getDate() + 12);
        const fertileEnd = new Date(lastPeriodDate);
        fertileEnd.setDate(fertileEnd.getDate() + 16);
        document.getElementById('nextFertile').textContent = `${fertileStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${fertileEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }

    // Update today's symptoms if available
    if (currentCycleData && currentCycleData.symptoms) {
        todaySymptoms = currentCycleData.symptoms.reduce((obj, symptom) => {
            obj[symptom] = true;
            return obj;
        }, {});
    }

    // Update flow
    if (currentCycleData && currentCycleData.flow) {
        todayFlow = currentCycleData.flow;
        document.getElementById('currentFlow').innerHTML = `<span>Today's flow: <strong>${capitalize(todayFlow)}</strong></span>`;

        // Highlight selected flow button
        document.querySelectorAll('.flow-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.flow === todayFlow) {
                btn.classList.add('active');
            }
        });
    }
}

// ================= HELPER FUNCTIONS =================
function calculateCycleDay(lastPeriodDate) {
    const today = new Date();
    const lastPeriod = new Date(lastPeriodDate);
    const diffTime = Math.abs(today - lastPeriod);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ================= LOG PERIOD =================
async function logPeriod() {
    const lastPeriodDate = prompt('Enter the start date of your last period (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);

    if (!lastPeriodDate) return;

    const cycleLength = prompt('Enter your typical cycle length (days):', '28');
    const periodDuration = prompt('Enter your typical period duration (days):', '5');

    const cycleData = {
        lastPeriodDate: lastPeriodDate,
        cycleLength: parseInt(cycleLength) || 28,
        periodDuration: parseInt(periodDuration) || 5,
        symptoms: Object.keys(todaySymptoms),
        flow: todayFlow || 'medium',
        mood: [],
        notes: ''
    };

    try {
        const result = await HealthDataService.saveMenstruationCycle(currentUser.uid, cycleData);

        if (result.success) {
            console.log('✅ Period logged successfully');
            alert('Period logged successfully!');
            await loadMenstruationData();
            updateUI();
            initializeCalendar();
        } else {
            console.error('❌ Failed to log period');
            alert('Failed to log period. Please try again.');
        }
    } catch (error) {
        console.error('❌ Error logging period:', error);
        alert('An error occurred. Please try again.');
    }
}

// ================= SYMPTOM TRACKING =================
function toggleSymptom(symptom) {
    todaySymptoms[symptom] = !todaySymptoms[symptom];

    const levelElement = document.getElementById(`${symptom}-level`);
    const itemElement = levelElement.closest('.symptom-item');

    if (todaySymptoms[symptom]) {
        itemElement.classList.add('active');
        levelElement.textContent = '✓';
    } else {
        itemElement.classList.remove('active');
        levelElement.textContent = '';
    }

    // Save symptoms
    saveCurrentDayData();
}

// ================= FLOW TRACKING =================
function setFlow(flow) {
    todayFlow = flow;

    document.getElementById('currentFlow').innerHTML = `<span>Today's flow: <strong>${capitalize(flow)}</strong></span>`;

    // Highlight selected button
    document.querySelectorAll('.flow-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.flow === flow) {
            btn.classList.add('active');
        }
    });

    // Save flow
    saveCurrentDayData();
}

// ================= SAVE CURRENT DAY DATA =================
async function saveCurrentDayData() {
    if (!currentCycleData) return;

    // Update current cycle data with today's info
    currentCycleData.symptoms = Object.keys(todaySymptoms).filter(s => todaySymptoms[s]);
    currentCycleData.flow = todayFlow;

    // Save to database
    try {
        await HealthDataService.saveMenstruationCycle(currentUser.uid, currentCycleData);
        console.log('✅ Current day data saved');
    } catch (error) {
        console.error('❌ Error saving current day data:', error);
    }
}

// ================= CALENDAR =================
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function initializeCalendar() {
    renderCalendar();
}

function renderCalendar() {
    const monthYear = document.getElementById('monthYear');
    const calendarContainer = document.getElementById('calendarContainer');

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    // Clear calendar
    calendarContainer.innerHTML = '';

    // Show empty state if no data
    if (!currentCycleData) {
        calendarContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: #9ca3af;">
                <div style="font-size: 48px; margin-bottom: 16px;">📅</div>
                <h3 style="color: #ec4899; margin-bottom: 8px;">No Cycles Logged Yet</h3>
                <p style="margin-bottom: 20px;">Click "Log Period" above to track your first cycle!</p>
                <button onclick="logPeriod()" style="background: #ec4899; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">
                    ➕ Log Your First Period
                </button>
            </div>
        `;
        return;
    }

    // Create calendar grid
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarContainer.appendChild(header);
    });

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarContainer.appendChild(emptyDay);
    }

    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        // Check if this day is in period/fertile/ovulation
        const currentDate = new Date(currentYear, currentMonth, day);
        if (currentCycleData) {
            const lastPeriod = new Date(currentCycleData.lastPeriodDate);
            const daysSinceLastPeriod = Math.floor((currentDate - lastPeriod) / (1000 * 60 * 60 * 24));

            if (daysSinceLastPeriod >= 0 && daysSinceLastPeriod < (currentCycleData.periodDuration || 5)) {
                dayElement.classList.add('period');
            } else if (daysSinceLastPeriod >= 12 && daysSinceLastPeriod <= 16) {
                dayElement.classList.add('fertile');
            } else if (daysSinceLastPeriod === 14) {
                dayElement.classList.add('ovulation');
            }
        }

        // Highlight today
        const today = new Date();
        if (currentYear === today.getFullYear() && currentMonth === today.getMonth() && day === today.getDate()) {
            dayElement.classList.add('today');
        }

        calendarContainer.appendChild(dayElement);
    }
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// ================= CHART =================
function initializeChart() {
    const ctx = document.getElementById('cycleChart');
    if (!ctx) return;

    const cycleLengths = menstruationHistory.slice(0, 6).reverse().map(cycle => cycle.cycleLength || 28);
    const labels = menstruationHistory.slice(0, 6).reverse().map((_, i) => `Cycle ${i + 1}`);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cycle Length (days)',
                data: cycleLengths,
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 20,
                    max: 35,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#9ca3af' }
                },
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
}

// ================= SETTINGS =================
function openSettings() {
    alert('Menstruation settings coming soon!');
}

function editCycleInfo() {
    const cycleLength = prompt('Enter your typical cycle length (days):', currentCycleData?.cycleLength || '28');
    const periodDuration = prompt('Enter your typical period duration (days):', currentCycleData?.periodDuration || '5');

    if (cycleLength && periodDuration) {
        if (currentCycleData) {
            currentCycleData.cycleLength = parseInt(cycleLength);
            currentCycleData.periodDuration = parseInt(periodDuration);
            saveCurrentDayData();
            updateUI();
        }
    }
}

// ================= SIDEBAR TOGGLE =================
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// ================= INITIALIZE =================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔵 Women\'s Health page loading...');
    await checkAuthAndLoadData();
    console.log('✅ Women\'s Health page loaded');
});

// Make functions globally available
window.logPeriod = logPeriod;
window.toggleSymptom = toggleSymptom;
window.setFlow = setFlow;
window.previousMonth = previousMonth;
window.nextMonth = nextMonth;
window.openSettings = openSettings;
window.editCycleInfo = editCycleInfo;
window.toggleSidebar = toggleSidebar;

console.log('💚 Women\'s Health Real-Time Integration loaded');
