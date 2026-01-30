// ================= HEALTH DETAILS CUSTOM JAVASCRIPT =================

// Current step tracker
let currentStep = 1;
let selectedAvatar = null;

// Avatar mapping
const avatarMap = {
    'avatar1': { emoji: '👨‍💼', name: 'Professional' },
    'avatar2': { emoji: '👩‍💼', name: 'Executive' },
    'avatar3': { emoji: '👨‍⚕️', name: 'Doctor' },
    'avatar4': { emoji: '👩‍⚕️', name: 'Nurse' },
    'avatar5': { emoji: '👨‍🎓', name: 'Student' },
    'avatar6': { emoji: '👩‍🎓', name: 'Scholar' },
    'avatar7': { emoji: '👨‍💻', name: 'Developer' },
    'avatar8': { emoji: '👩‍💻', name: 'Coder' },
    'avatar9': { emoji: '🧑‍🎨', name: 'Artist' },
    'avatar10': { emoji: '👨‍🍳', name: 'Chef' },
    'avatar11': { emoji: '👩‍🏫', name: 'Teacher' },
    'avatar12': { emoji: '🧑‍🚀', name: 'Astronaut' },
    'avatar13': { emoji: '👨‍🔬', name: 'Scientist' },
    'avatar14': { emoji: '👩‍🔬', name: 'Researcher' },
    'avatar15': { emoji: '🧑‍⚖️', name: 'Lawyer' },
    'avatar16': { emoji: '👨‍🏭', name: 'Engineer' }
};

// Navigate to next step
function nextStep(step) {
    // Validate current step before proceeding
    if (!validateCurrentStep()) {
        return;
    }

    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`progressStep${currentStep}`).classList.add('completed');
    document.getElementById(`progressStep${currentStep}`).classList.remove('active');

    // Animate progress line
    if (currentStep < 4) {
        document.getElementById(`progressLine${currentStep}`).classList.add('completed');
    }

    // Show next step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.getElementById(`progressStep${currentStep}`).classList.add('active');

    // Update summary if on last step
    if (currentStep === 3) {
        updateSummary();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigate to previous step
function prevStep(step) {
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`progressStep${currentStep}`).classList.remove('active');

    // Remove completed status from previous line
    if (step < 4) {
        document.getElementById(`progressLine${step}`).classList.remove('completed');
    }

    // Show previous step
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.getElementById(`progressStep${currentStep}`).classList.add('active');
    document.getElementById(`progressStep${currentStep}`).classList.remove('completed');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Validate current step
function validateCurrentStep() {
    if (currentStep === 1) {
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const height = document.getElementById('height').value;
        const weight = document.getElementById('weight').value;

        if (!age || !gender || !height || !weight) {
            UIHelpers.showError('Please fill in all required fields');
            return false;
        }

        if (age < 1 || age > 120) {
            UIHelpers.showError('Please enter a valid age');
            return false;
        }

        if (height < 50 || height > 300) {
            UIHelpers.showError('Please enter a valid height');
            return false;
        }

        if (weight < 20 || weight > 500) {
            UIHelpers.showError('Please enter a valid weight');
            return false;
        }
    } else if (currentStep === 2) {
        const smokingHabit = document.getElementById('smokingHabit').value;
        const alcoholConsumption = document.getElementById('alcoholConsumption').value;
        const sleepQuality = document.getElementById('sleepQuality').value;

        if (!smokingHabit || !alcoholConsumption || !sleepQuality) {
            UIHelpers.showError('Please fill in all lifestyle habit fields');
            return false;
        }
    }

    return true;
}

// Calculate BMI
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);

    if (height && weight && height > 0 && weight > 0) {
        // BMI = weight (kg) / (height (m))^2
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

        // Show BMI card
        const bmiDisplay = document.getElementById('bmiDisplay');
        bmiDisplay.style.display = 'block';

        // Update BMI value
        document.getElementById('bmiValue').textContent = bmi;

        // Determine category
        const categoryElement = document.getElementById('bmiCategory');
        let category = '';
        let categoryClass = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            categoryClass = 'underweight';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal Weight';
            categoryClass = 'normal';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            categoryClass = 'overweight';
        } else {
            category = 'Obese';
            categoryClass = 'obese';
        }

        categoryElement.textContent = category;
        categoryElement.className = `bmi-category ${categoryClass}`;
    } else {
        document.getElementById('bmiDisplay').style.display = 'none';
    }
}

// Handle gender change
function handleGenderChange() {
    const gender = document.getElementById('gender').value;
    const menstruationSection = document.getElementById('menstruationSection');

    if (gender === 'female') {
        menstruationSection.style.display = 'block';
    } else {
        menstruationSection.style.display = 'none';
    }
}

// Update summary
function updateSummary() {
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const smokingHabit = document.getElementById('smokingHabit').value;
    const alcoholConsumption = document.getElementById('alcoholConsumption').value;
    const sleepQuality = document.getElementById('sleepQuality').value;
    const medicalCondition = document.getElementById('medicalCondition').value;

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

    const summaryHTML = `
        <div class="summary-item">
            <span class="summary-label">Age</span>
            <span class="summary-value">${age} years</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Gender</span>
            <span class="summary-value">${gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Height</span>
            <span class="summary-value">${height} cm</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Weight</span>
            <span class="summary-value">${weight} kg</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">BMI</span>
            <span class="summary-value">${bmi}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Smoking</span>
            <span class="summary-value">${smokingHabit.charAt(0).toUpperCase() + smokingHabit.slice(1)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Alcohol</span>
            <span class="summary-value">${alcoholConsumption.charAt(0).toUpperCase() + alcoholConsumption.slice(1)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Sleep</span>
            <span class="summary-value">${sleepQuality.charAt(0).toUpperCase() + sleepQuality.slice(1)}</span>
        </div>
        ${medicalCondition ? `
        <div class="summary-item">
            <span class="summary-label">Medical Condition</span>
            <span class="summary-value">${medicalCondition === 'none' ? 'None' : medicalCondition.charAt(0).toUpperCase() + medicalCondition.slice(1)}</span>
        </div>
        ` : ''}
    `;

    document.getElementById('summaryContent').innerHTML = summaryHTML;
}

// Avatar selection function
function selectAvatar(avatarId) {
    // Remove previous selection
    const allAvatars = document.querySelectorAll('.avatar-option');
    allAvatars.forEach(avatar => avatar.classList.remove('selected'));

    // Add selection to clicked avatar
    const selectedElement = document.querySelector(`[data-avatar="${avatarId}"]`);
    if (selectedElement) {
        selectedElement.classList.add('selected');
    }

    // Update selected avatar
    selectedAvatar = avatarId;

    // Show preview
    const avatarPreview = document.getElementById('avatarPreview');
    const previewImage = document.getElementById('previewAvatarImage');
    const previewName = document.getElementById('previewAvatarName');

    if (avatarMap[avatarId]) {
        previewImage.textContent = avatarMap[avatarId].emoji;
        previewName.textContent = avatarMap[avatarId].name;
        avatarPreview.style.display = 'block';
    }
}

// Require authentication
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});

// Handle form submission
document.getElementById('healthForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate final step
    if (!validateCurrentStep()) {
        return;
    }

    const submitBtn = this.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Saving...</span>';
    submitBtn.disabled = true;

    try {
        const user = auth.currentUser;
        if (!user) {
            UIHelpers.showError('Please sign in first');
            window.location.href = 'login.html';
            return;
        }

        // Collect form data
        const age = parseInt(document.getElementById('age').value);
        const height = parseInt(document.getElementById('height').value);
        const weight = parseInt(document.getElementById('weight').value);
        const gender = document.getElementById('gender').value;

        const healthData = {
            age: age,
            height: height,
            weight: weight,
            gender: gender,
            smokingHabit: document.getElementById('smokingHabit').value,
            alcoholConsumption: document.getElementById('alcoholConsumption').value,
            sleepQuality: document.getElementById('sleepQuality').value,
            medicalCondition: document.getElementById('medicalCondition').value,
            avatar: selectedAvatar || 'avatar1',
            avatarEmoji: avatarMap[selectedAvatar || 'avatar1'].emoji,
            avatarName: avatarMap[selectedAvatar || 'avatar1'].name,
            // Medical History
            bloodType: document.getElementById('bloodType').value || 'Not set',
            allergies: document.getElementById('allergies').value.trim() || 'None known',
            currentMedications: document.getElementById('currentMedications').value.trim() || 'None',
            pastSurgeries: document.getElementById('pastSurgeries').value.trim() || 'None',
            familyHistory: document.getElementById('familyHistory').value.trim() || 'No significant family history'
        };

        // Add menstruation data if applicable
        if (gender === 'female') {
            const cycleLength = document.getElementById('cycleLength').value;
            const periodDuration = document.getElementById('periodDuration').value;
            const painLevel = document.getElementById('painLevel').value;
            const flowType = document.getElementById('flowType').value;
            const irregularPeriods = document.getElementById('irregularPeriods').checked;

            if (cycleLength || periodDuration || painLevel || flowType) {
                healthData.menstruation = {
                    cycleLength: cycleLength ? parseInt(cycleLength) : null,
                    periodDuration: periodDuration ? parseInt(periodDuration) : null,
                    painLevel: painLevel || null,
                    flowType: flowType || null,
                    irregularPeriods: irregularPeriods
                };
            }
        }

        // Save to Firestore
        const result = await UserService.saveHealthDetails(user.uid, healthData);

        if (result.success) {
            UIHelpers.showSuccess('Health profile completed successfully! 🎉');

            setTimeout(() => {
                window.location.href = '../dashboard/dashboard.html';
            }, 1500);
        } else {
            UIHelpers.showError('Failed to save health details. Please try again.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error saving health details:', error);
        UIHelpers.showError('An error occurred. Please try again.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});
