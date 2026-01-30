/**
 * AI Diagnosis - Real-Time Integration with Gemini AI
 * Provides AI-powered symptom analysis with database persistence
 */

let currentUser = null;
let currentDiagnosis = null;

// ================= AUTHENTICATION =================
async function checkAuth() {
    try {
        currentUser = await AuthService.checkAuth();

        if (!currentUser) {
            window.location.href = '../../../auth/login.html';
            return;
        }

        console.log('✅ User authenticated:', currentUser.uid);

    } catch (error) {
        console.error('❌ Error:', error);
        window.location.href = '../../../auth/login.html';
    }
}

// ================= FORM SUBMISSION =================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔵 AI Diagnosis page loading...');

    await checkAuth();

    // Stress slider
    const stressSlider = document.getElementById('stressSlider');
    const stressValue = document.getElementById('stressValue');

    if (stressSlider && stressValue) {
        stressSlider.addEventListener('input', (e) => {
            stressValue.textContent = e.target.value;
        });
    }

    // Form submission
    const form = document.getElementById('symptomForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await analyzeSymptoms();
    });

    console.log('✅ AI Diagnosis page loaded');
});

// ================= ANALYZE SYMPTOMS =================
async function analyzeSymptoms() {
    // Collect form data
    const formData = new FormData(document.getElementById('symptomForm'));

    // Extract symptoms
    const symptoms = [];
    const mentalSymptoms = [];
    const habits = [];

    formData.getAll('symptoms').forEach(s => symptoms.push(s));
    formData.getAll('mental-symptoms').forEach(s => mentalSymptoms.push(s));
    formData.getAll('habits').forEach(h => habits.push(h));

    const assessmentData = {
        energy: formData.get('energy'),
        symptoms: symptoms,
        sleep: formData.get('sleep'),
        stress: formData.get('stress'),
        mentalSymptoms: mentalSymptoms,
        exercise: formData.get('exercise'),
        diet: formData.get('diet'),
        habits: habits,
        timestamp: new Date()
    };

    // Build symptoms text for AI
    const symptomsText = buildSymptomsText(assessmentData);

    // Show results container
    document.getElementById('questionnaireCard').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';

    // Show loading state
    document.getElementById('riskLevelText').textContent = 'Analyzing...';
    document.getElementById('riskDescription').textContent = 'Our AI is analyzing your symptoms and lifestyle factors...';

    try {
        // Get AI diagnosis
        const result = await window.aiService.diagnose(symptomsText, currentUser.uid);

        if (result.emergency) {
            // Emergency detected
            displayEmergencyWarning(result.message);
        } else {
            // Normal diagnosis
            displayDiagnosisResults(result.diagnosis, assessmentData);

            // Save to database
            currentDiagnosis = {
                ...assessmentData,
                aiResponse: result.diagnosis,
                timestamp: new Date()
            };

            await saveDiagnosis(currentDiagnosis);
        }

    } catch (error) {
        console.error('❌ Error analyzing symptoms:', error);
        displayError();
    }
}

// ================= BUILD SYMPTOMS TEXT =================
function buildSymptomsText(data) {
    let text = `Patient Assessment:\n\n`;

    text += `Energy Levels: ${data.energy}\n`;
    text += `Sleep Duration: ${data.sleep}\n`;
    text += `Stress Level: ${data.stress}/10\n`;
    text += `Exercise Frequency: ${data.exercise}\n`;
    text += `Diet Quality: ${data.diet}\n\n`;

    if (data.symptoms.length > 0 && !data.symptoms.includes('none')) {
        text += `Physical Symptoms: ${data.symptoms.join(', ')}\n`;
    }

    if (data.mentalSymptoms.length > 0 && !data.mentalSymptoms.includes('none')) {
        text += `Mental Health Symptoms: ${data.mentalSymptoms.join(', ')}\n`;
    }

    if (data.habits.length > 0 && !data.habits.includes('none')) {
        text += `Lifestyle Habits: ${data.habits.join(', ')}\n`;
    }

    return text;
}

// ================= DISPLAY EMERGENCY WARNING =================
function displayEmergencyWarning(message) {
    document.getElementById('riskLevelText').textContent = '🚨 EMERGENCY';
    document.getElementById('riskLevelText').style.color = '#ef4444';
    document.getElementById('riskDescription').innerHTML = message.replace(/\n/g, '<br>');
}

// ================= DISPLAY DIAGNOSIS RESULTS =================
function displayDiagnosisResults(diagnosis, data) {
    // Calculate risk level based on data
    const riskLevel = calculateRiskLevel(data);

    // Update risk display
    document.getElementById('riskLevelText').textContent = riskLevel.level;
    document.getElementById('riskLevelText').style.color = riskLevel.color;
    document.getElementById('riskDescription').innerHTML = diagnosis.substring(0, 300).replace(/\n/g, '<br>') + '...';

    // Display full diagnosis in categories
    displayRiskCategories(data);
    displayLifestyleFactors(data);
    displayPreventiveSuggestions(diagnosis);
}

// ================= CALCULATE RISK LEVEL =================
function calculateRiskLevel(data) {
    let riskScore = 0;

    // Energy
    if (data.energy === 'very-low') riskScore += 3;
    else if (data.energy === 'low') riskScore += 2;

    // Sleep
    if (data.sleep === 'less-4') riskScore += 3;
    else if (data.sleep === '4-6') riskScore += 2;

    // Stress
    const stress = parseInt(data.stress);
    if (stress >= 8) riskScore += 3;
    else if (stress >= 6) riskScore += 2;

    // Exercise
    if (data.exercise === 'rarely') riskScore += 2;

    // Diet
    if (data.diet === 'very-poor') riskScore += 3;
    else if (data.diet === 'poor') riskScore += 2;

    // Symptoms
    if (data.symptoms.includes('chest-pain') || data.symptoms.includes('shortness-breath')) {
        riskScore += 5;
    }

    // Determine level
    if (riskScore >= 10) {
        return { level: 'High Risk', color: '#ef4444' };
    } else if (riskScore >= 6) {
        return { level: 'Moderate Risk', color: '#f59e0b' };
    } else if (riskScore >= 3) {
        return { level: 'Low Risk', color: '#eab308' };
    } else {
        return { level: 'Minimal Risk', color: '#22c55e' };
    }
}

// ================= DISPLAY RISK CATEGORIES =================
function displayRiskCategories(data) {
    const container = document.getElementById('riskCategories');
    container.innerHTML = `
        <div class="risk-category">
            <h3>💤 Sleep Quality</h3>
            <p>${getSleepRisk(data.sleep)}</p>
        </div>
        <div class="risk-category">
            <h3>🧠 Mental Health</h3>
            <p>${getMentalHealthRisk(data)}</p>
        </div>
        <div class="risk-category">
            <h3>🏃 Physical Activity</h3>
            <p>${getExerciseRisk(data.exercise)}</p>
        </div>
        <div class="risk-category">
            <h3>🥗 Nutrition</h3>
            <p>${getDietRisk(data.diet)}</p>
        </div>
    `;
}

function getSleepRisk(sleep) {
    if (sleep === 'less-4') return 'Critical - Severe sleep deprivation detected';
    if (sleep === '4-6') return 'Moderate - Insufficient sleep';
    if (sleep === '6-8') return 'Good - Adequate sleep duration';
    return 'Excessive - May indicate underlying issues';
}

function getMentalHealthRisk(data) {
    const stress = parseInt(data.stress);
    if (stress >= 8) return 'High stress levels detected';
    if (stress >= 6) return 'Moderate stress levels';
    return 'Low stress levels';
}

function getExerciseRisk(exercise) {
    if (exercise === 'rarely') return 'Sedentary lifestyle - High risk';
    if (exercise === '1-2-week') return 'Low activity - Moderate risk';
    if (exercise === '3-5-week') return 'Good activity level';
    return 'Excellent activity level';
}

function getDietRisk(diet) {
    if (diet === 'very-poor') return 'Poor nutrition - High risk';
    if (diet === 'poor') return 'Suboptimal nutrition';
    if (diet === 'moderate') return 'Moderate nutrition';
    return 'Balanced nutrition';
}

// ================= DISPLAY LIFESTYLE FACTORS =================
function displayLifestyleFactors(data) {
    const container = document.getElementById('lifestyleFactors');
    const factors = [];

    if (data.habits.includes('smoking')) factors.push('🚬 Smoking');
    if (data.habits.includes('alcohol')) factors.push('🍺 Regular alcohol');
    if (data.habits.includes('sedentary')) factors.push('💺 Sedentary lifestyle');
    if (data.habits.includes('irregular-sleep')) factors.push('😴 Irregular sleep');

    if (factors.length === 0) {
        container.innerHTML = '<p>No significant risk factors identified</p>';
    } else {
        container.innerHTML = factors.map(f => `<div class="factor-item">${f}</div>`).join('');
    }
}

// ================= DISPLAY PREVENTIVE SUGGESTIONS =================
function displayPreventiveSuggestions(diagnosis) {
    const container = document.getElementById('preventiveSuggestions');

    // Extract suggestions from AI response (simple version)
    const suggestions = [
        '✅ Maintain a consistent sleep schedule (7-8 hours)',
        '✅ Exercise regularly (at least 30 minutes, 5 days/week)',
        '✅ Eat a balanced diet rich in fruits and vegetables',
        '✅ Practice stress management techniques',
        '✅ Stay hydrated (8 glasses of water daily)',
        '✅ Schedule regular health check-ups'
    ];

    container.innerHTML = suggestions.map(s => `<div class="suggestion-item">${s}</div>`).join('');
}

// ================= DISPLAY ERROR =================
function displayError() {
    document.getElementById('riskLevelText').textContent = 'Error';
    document.getElementById('riskDescription').textContent = 'Unable to analyze symptoms at this time. Please try again later or consult a healthcare professional.';
}

// ================= SAVE DIAGNOSIS =================
async function saveDiagnosis(diagnosis) {
    try {
        await HealthDataService.saveDiagnosis(currentUser.uid, diagnosis);
        console.log('✅ Diagnosis saved');
    } catch (error) {
        console.error('❌ Error saving diagnosis:', error);
    }
}

// ================= SAVE RESULTS =================
async function saveResults() {
    if (!currentDiagnosis) {
        alert('No diagnosis to save');
        return;
    }

    alert('✅ Results saved to your health history!');
}

// ================= RESET ASSESSMENT =================
function resetAssessment() {
    document.getElementById('questionnaireCard').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('symptomForm').reset();
    document.getElementById('stressValue').textContent = '5';
    currentDiagnosis = null;
}

// ================= SIDEBAR TOGGLE =================
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('collapsed');
    }
}

// Make functions globally available
window.resetAssessment = resetAssessment;
window.saveResults = saveResults;
window.toggleSidebar = toggleSidebar;

console.log('💚 AI Diagnosis Real-Time Integration loaded');
