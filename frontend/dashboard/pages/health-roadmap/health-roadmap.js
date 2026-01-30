/**
 * Health Roadmap - Real-Time Database Integration
 * Loads and saves personalized health roadmap with progress tracking
 */

let currentUser = null;
let roadmapData = null;
let stepProgress = {};

// ================= AUTHENTICATION & DATA LOADING =================
async function checkAuthAndLoadData() {
    try {
        currentUser = await AuthService.checkAuth();

        if (!currentUser) {
            window.location.href = '../../../auth/login.html';
            return;
        }

        console.log('✅ User authenticated:', currentUser.uid);
        await loadRoadmap();
        updateUI();
        initializeCheckboxListeners();

    } catch (error) {
        console.error('❌ Error loading roadmap:', error);
        window.location.href = '../../../auth/login.html';
    }
}

// ================= LOAD ROADMAP =================
async function loadRoadmap() {
    try {
        const result = await HealthDataService.getRoadmap(currentUser.uid);

        if (result.success && result.data) {
            roadmapData = result.data;
            stepProgress = roadmapData.progress || {};
            console.log('✅ Roadmap loaded:', roadmapData);
        } else {
            console.warn('⚠️ No roadmap found, using default');
            roadmapData = createDefaultRoadmap();
            stepProgress = {};
        }
    } catch (error) {
        console.error('❌ Error loading roadmap:', error);
        roadmapData = createDefaultRoadmap();
        stepProgress = {};
    }
}

// ================= CREATE DEFAULT ROADMAP =================
function createDefaultRoadmap() {
    return {
        createdAt: new Date(),
        currentHealthDebt: 18,
        goalHealthDebt: 5,
        currentRisk: 25,
        goalRisk: 10,
        duration: 12, // weeks
        steps: [
            {
                id: 'sleep',
                week: '1-2',
                title: '🌙 Optimize Sleep Schedule',
                priority: 'high',
                effort: 'low',
                actions: [
                    'Set a consistent bedtime (10:30 PM)',
                    'Wake up at the same time daily (6:30 AM)',
                    'No screens 1 hour before bed',
                    'Create a relaxing bedtime routine'
                ],
                impact: { healthDebt: -7, risk: -8, energy: 35 }
            },
            {
                id: 'diet',
                week: '3-4',
                title: '🥗 Improve Diet Quality',
                priority: 'high',
                effort: 'medium',
                actions: [
                    'Eat 5 servings of fruits/vegetables daily',
                    'Drink 8 glasses of water per day',
                    'Reduce processed foods by 50%',
                    'Plan meals for the week ahead'
                ],
                impact: { healthDebt: -5, energy: 25, immunity: 30 }
            },
            {
                id: 'stress',
                week: '5-6',
                title: '🧘 Reduce Stress Levels',
                priority: 'medium',
                effort: 'low',
                actions: [
                    'Practice 10 minutes of meditation daily',
                    'Use the 4-7-8 breathing technique',
                    'Take regular breaks during work',
                    'Journal for 5 minutes before bed'
                ],
                impact: { healthDebt: -3, clarity: 40, sleep: 20 }
            },
            {
                id: 'exercise',
                week: '7-8',
                title: '🏃 Establish Exercise Routine',
                priority: 'high',
                effort: 'high',
                actions: [
                    '30 minutes of cardio, 5 days/week',
                    'Strength training 2 days/week',
                    'Take 10,000 steps daily',
                    'Stretch for 10 minutes after workouts'
                ],
                impact: { healthDebt: -4, cardiovascular: 45, mood: 35 }
            },
            {
                id: 'hydration',
                week: '9-10',
                title: '💧 Optimize Hydration',
                priority: 'medium',
                effort: 'low',
                actions: [
                    'Drink 8 glasses (2L) of water daily',
                    'Start each day with a glass of water',
                    'Carry a reusable water bottle',
                    'Track water intake on Dashboard'
                ],
                impact: { healthDebt: -2, energy: 20, skin: 25 }
            },
            {
                id: 'maintain',
                week: '11-12',
                title: '🎯 Maintain & Optimize',
                priority: 'high',
                effort: 'medium',
                actions: [
                    'Review progress on all 5 previous steps',
                    'Take AI-Diagnosis assessment',
                    'Set new health goals',
                    'Celebrate your achievements!'
                ],
                impact: { healthDebt: '<5', risk: '<10', lifestyle: '95+' }
            }
        ],
        progress: {}
    };
}

// ================= UPDATE UI =================
function updateUI() {
    if (!roadmapData) return;

    // Update overall progress
    calculateAndUpdateProgress();

    // Update each step's checkboxes
    const steps = document.querySelectorAll('.roadmap-step');
    steps.forEach((stepElement, index) => {
        const stepId = roadmapData.steps[index]?.id;
        if (!stepId) return;

        const checkboxes = stepElement.querySelectorAll('.action-item input[type="checkbox"]');
        const progress = stepProgress[stepId] || [];

        checkboxes.forEach((checkbox, actionIndex) => {
            checkbox.checked = progress.includes(actionIndex);
        });

        // Update step progress bar
        updateStepProgress(stepElement, progress.length, checkboxes.length);
    });
}

// ================= UPDATE STEP PROGRESS =================
function updateStepProgress(stepElement, completed, total) {
    const progressFill = stepElement.querySelector('.progress-fill');
    const progressText = stepElement.querySelector('.progress-text');

    if (progressFill && progressText) {
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% Complete`;
    }
}

// ================= CALCULATE OVERALL PROGRESS =================
function calculateAndUpdateProgress() {
    let totalActions = 0;
    let completedActions = 0;

    roadmapData.steps.forEach(step => {
        const stepId = step.id;
        const progress = stepProgress[stepId] || [];
        totalActions += step.actions.length;
        completedActions += progress.length;
    });

    const overallPercentage = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

    // Update circular progress
    const progressRing = document.querySelector('.progress-ring');
    const progressPercentage = document.querySelector('.progress-percentage');

    if (progressRing && progressPercentage) {
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (overallPercentage / 100) * circumference;
        progressRing.style.strokeDashoffset = offset;
        progressPercentage.textContent = `${overallPercentage}%`;
    }

    // Update stats
    const completedSteps = Object.keys(stepProgress).filter(stepId => {
        const step = roadmapData.steps.find(s => s.id === stepId);
        const progress = stepProgress[stepId] || [];
        return step && progress.length === step.actions.length;
    }).length;

    const stepsCompletedStat = document.querySelector('.progress-stats .stat-value');
    if (stepsCompletedStat) {
        stepsCompletedStat.textContent = `${completedSteps} / ${roadmapData.steps.length}`;
    }

    // Calculate remaining weeks
    const weeksRemaining = Math.max(0, roadmapData.duration - Math.floor((completedSteps / roadmapData.steps.length) * roadmapData.duration));
    const timeRemainingStat = document.querySelectorAll('.progress-stats .stat-value')[1];
    if (timeRemainingStat) {
        timeRemainingStat.textContent = `${weeksRemaining} weeks`;
    }
}

// ================= INITIALIZE CHECKBOX LISTENERS =================
function initializeCheckboxListeners() {
    const steps = document.querySelectorAll('.roadmap-step');

    steps.forEach((stepElement, stepIndex) => {
        const stepId = roadmapData.steps[stepIndex]?.id;
        if (!stepId) return;

        const checkboxes = stepElement.querySelectorAll('.action-item input[type="checkbox"]');

        checkboxes.forEach((checkbox, actionIndex) => {
            checkbox.addEventListener('change', async (e) => {
                if (!stepProgress[stepId]) {
                    stepProgress[stepId] = [];
                }

                if (e.target.checked) {
                    if (!stepProgress[stepId].includes(actionIndex)) {
                        stepProgress[stepId].push(actionIndex);
                    }
                } else {
                    stepProgress[stepId] = stepProgress[stepId].filter(i => i !== actionIndex);
                }

                // Update step progress bar
                updateStepProgress(stepElement, stepProgress[stepId].length, checkboxes.length);

                // Update overall progress
                calculateAndUpdateProgress();

                // Save to database
                await saveRoadmapProgress();
            });
        });
    });
}

// ================= SAVE ROADMAP PROGRESS =================
async function saveRoadmapProgress() {
    try {
        roadmapData.progress = stepProgress;
        roadmapData.lastUpdated = new Date();

        const result = await HealthDataService.saveRoadmap(currentUser.uid, roadmapData);

        if (result.success) {
            console.log('✅ Roadmap progress saved');
        } else {
            console.error('❌ Failed to save roadmap progress');
        }
    } catch (error) {
        console.error('❌ Error saving roadmap progress:', error);
    }
}

// ================= TOGGLE STEP =================
function toggleStep(button) {
    const stepCard = button.closest('.roadmap-step');
    const stepContent = stepCard.querySelector('.step-content');
    const toggleIcon = button.querySelector('span');

    if (stepContent.style.display === 'none' || !stepContent.style.display) {
        stepContent.style.display = 'block';
        toggleIcon.textContent = '▲';
    } else {
        stepContent.style.display = 'none';
        toggleIcon.textContent = '▼';
    }
}

// ================= REGENERATE ROADMAP =================
async function regenerateRoadmap() {
    if (!confirm('⚠️ This will create a new roadmap and reset your progress. Are you sure?')) {
        return;
    }

    try {
        roadmapData = createDefaultRoadmap();
        stepProgress = {};

        const result = await HealthDataService.saveRoadmap(currentUser.uid, roadmapData);

        if (result.success) {
            console.log('✅ Roadmap regenerated');
            alert('Roadmap regenerated successfully!');
            location.reload();
        } else {
            console.error('❌ Failed to regenerate roadmap');
            alert('Failed to regenerate roadmap. Please try again.');
        }
    } catch (error) {
        console.error('❌ Error regenerating roadmap:', error);
        alert('An error occurred. Please try again.');
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
    console.log('🔵 Health Roadmap page loading...');
    await checkAuthAndLoadData();
    console.log('✅ Health Roadmap page loaded');
});

// Make functions globally available
window.toggleStep = toggleStep;
window.regenerateRoadmap = regenerateRoadmap;
window.toggleSidebar = toggleSidebar;

console.log('💚 Health Roadmap Real-Time Integration loaded');
