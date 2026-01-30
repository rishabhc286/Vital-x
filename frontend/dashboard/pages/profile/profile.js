/**
 * Profile Page - Real-Time Database Integration
 * Loads and saves user profile data to Firebase
 */

let currentUser = null;
let userProfile = null;

// ================= AUTHENTICATION & DATA LOADING =================
async function checkAuthAndLoadProfile() {
    try {
        currentUser = await AuthService.checkAuth();

        if (!currentUser) {
            window.location.href = '../../../auth/login.html';
            return;
        }

        console.log('✅ User authenticated:', currentUser.uid);
        await loadUserProfile();
        updateProfileUI();

    } catch (error) {
        console.error('❌ Error loading profile:', error);
        window.location.href = '../../../auth/login.html';
    }
}

// ================= LOAD USER PROFILE =================
async function loadUserProfile() {
    try {
        const result = await UserService.getUserProfile(currentUser.uid);

        if (result.success) {
            userProfile = result.data;
            console.log('✅ Profile loaded:', userProfile);
        } else {
            console.warn('⚠️ No profile found, creating default');
            userProfile = createDefaultProfile();
        }
    } catch (error) {
        console.error('❌ Error loading profile:', error);
        userProfile = createDefaultProfile();
    }
}

// ================= CREATE DEFAULT PROFILE =================
function createDefaultProfile() {
    return {
        uid: currentUser.uid,
        email: currentUser.email,
        firstName: currentUser.displayName?.split(' ')[0] || 'User',
        lastName: currentUser.displayName?.split(' ')[1] || '',
        displayName: currentUser.displayName || 'User',
        healthDetails: {
            age: null,
            height: null,
            weight: null,
            gender: 'Not set',
            bmi: null,
            bloodType: 'Not set',
            activityLevel: 'Not set',
            allergies: 'None known',
            currentMedications: 'None',
            pastSurgeries: 'None',
            familyHistory: 'No significant family history',
            chronicConditions: 'None'
        },
        emergencyContacts: [],
        settings: {
            emailNotifications: true,
            smsNotifications: false,
            healthMonitoring: true,
            dataSharing: false
        },
        createdAt: new Date(),
        profileComplete: false
    };
}

// ================= UPDATE UI WITH PROFILE DATA =================
function updateProfileUI() {
    if (!userProfile) return;

    // Profile Header
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileAvatar = document.getElementById('profileAvatar');

    if (profileName) {
        profileName.textContent = userProfile.displayName || userProfile.firstName || 'User';
    }
    if (profileEmail) {
        profileEmail.textContent = userProfile.email;
    }
    if (profileAvatar) {
        const initials = getInitials(userProfile.displayName || userProfile.firstName);
        profileAvatar.textContent = initials;
    }

    // Member Since
    const memberSince = document.getElementById('memberSince');
    if (memberSince && userProfile.createdAt) {
        const year = userProfile.createdAt.toDate ?
            userProfile.createdAt.toDate().getFullYear() :
            new Date(userProfile.createdAt).getFullYear();
        memberSince.textContent = year;
    }

    // Personal Information
    const fullName = document.getElementById('fullName');
    if (fullName) {
        fullName.textContent = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || 'Not set';
    }

    const gender = document.getElementById('gender');
    if (gender && userProfile.healthDetails) {
        gender.textContent = userProfile.healthDetails.gender || 'Not set';
    }

    // Health Information
    if (userProfile.healthDetails) {
        const height = document.getElementById('height');
        const weight = document.getElementById('weight');
        const bloodType = document.getElementById('bloodType');
        const bmi = document.getElementById('bmi');
        const activityLevel = document.getElementById('activityLevel');

        if (height) height.textContent = userProfile.healthDetails.height ? `${userProfile.healthDetails.height} cm` : 'Not set';
        if (weight) weight.textContent = userProfile.healthDetails.weight ? `${userProfile.healthDetails.weight} kg` : 'Not set';
        if (bloodType) bloodType.textContent = userProfile.healthDetails.bloodType || 'Not set';
        if (bmi) bmi.textContent = userProfile.healthDetails.bmi || 'Not set';
        if (activityLevel) activityLevel.textContent = userProfile.healthDetails.activityLevel || 'Not set';
    }

    // Medical History
    const allergies = document.getElementById('allergies');
    const medications = document.getElementById('medications');
    const conditions = document.getElementById('conditions');
    const surgeries = document.getElementById('surgeries');
    const familyHistory = document.getElementById('familyHistory');

    if (userProfile.healthDetails) {
        if (allergies) allergies.textContent = userProfile.healthDetails.allergies || 'None known';
        if (medications) medications.textContent = userProfile.healthDetails.currentMedications || 'None';
        if (conditions) conditions.textContent = userProfile.healthDetails.chronicConditions || 'None';
        if (surgeries) surgeries.textContent = userProfile.healthDetails.pastSurgeries || 'None';
        if (familyHistory) familyHistory.textContent = userProfile.healthDetails.familyHistory || 'No significant family history';
    }

    // Settings
    if (userProfile.settings) {
        const emailNotifications = document.getElementById('emailNotifications');
        const smsNotifications = document.getElementById('smsNotifications');
        const healthMonitoring = document.getElementById('healthMonitoring');
        const dataSharing = document.getElementById('dataSharing');

        if (emailNotifications) emailNotifications.checked = userProfile.settings.emailNotifications || false;
        if (smsNotifications) smsNotifications.checked = userProfile.settings.smsNotifications || false;
        if (healthMonitoring) healthMonitoring.checked = userProfile.settings.healthMonitoring || false;
        if (dataSharing) dataSharing.checked = userProfile.settings.dataSharing || false;
    }
}

// ================= HELPER FUNCTIONS =================
function getInitials(name) {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// ================= EDIT FUNCTIONS =================
function editPersonalInfo() {
    const fullName = prompt('Enter your full name:', `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim());
    if (fullName) {
        const parts = fullName.split(' ');
        userProfile.firstName = parts[0] || '';
        userProfile.lastName = parts.slice(1).join(' ') || '';
        userProfile.displayName = fullName;
        saveProfile();
    }
}

function editHealthInfo() {
    const height = prompt('Enter your height (cm):', userProfile.healthDetails?.height || '');
    const weight = prompt('Enter your weight (kg):', userProfile.healthDetails?.weight || '');
    const bloodType = prompt('Enter your blood type:', userProfile.healthDetails?.bloodType || '');

    if (height || weight || bloodType) {
        if (!userProfile.healthDetails) userProfile.healthDetails = {};
        if (height) userProfile.healthDetails.height = parseFloat(height);
        if (weight) userProfile.healthDetails.weight = parseFloat(weight);
        if (bloodType) userProfile.healthDetails.bloodType = bloodType;

        // Calculate BMI
        if (userProfile.healthDetails.height && userProfile.healthDetails.weight) {
            userProfile.healthDetails.bmi = UserService.calculateBMI(
                userProfile.healthDetails.height,
                userProfile.healthDetails.weight
            );
        }

        saveProfile();
    }
}

function editMedicalHistory() {
    const allergies = prompt('Enter your allergies:', userProfile.healthDetails?.allergies || '');
    const medications = prompt('Enter current medications:', userProfile.healthDetails?.currentMedications || '');

    if (allergies || medications) {
        if (!userProfile.healthDetails) userProfile.healthDetails = {};
        if (allergies) userProfile.healthDetails.allergies = allergies;
        if (medications) userProfile.healthDetails.currentMedications = medications;
        saveProfile();
    }
}

function editEmergencyContacts() {
    alert('Emergency contacts editor coming soon!');
}

function changeAvatar() {
    alert('Avatar customization coming soon!');
}

function editProfile() {
    alert('Full profile editor coming soon!');
}

// ================= SAVE PROFILE =================
async function saveProfile() {
    try {
        const result = await UserService.updateProfile(currentUser.uid, userProfile);

        if (result.success) {
            console.log('✅ Profile saved successfully');
            updateProfileUI();
            if (window.UIHelpers) {
                UIHelpers.showSuccess('Profile updated successfully!');
            } else {
                alert('Profile updated successfully!');
            }
        } else {
            console.error('❌ Failed to save profile');
            if (window.UIHelpers) {
                UIHelpers.showError('Failed to save profile. Please try again.');
            } else {
                alert('Failed to save profile. Please try again.');
            }
        }
    } catch (error) {
        console.error('❌ Error saving profile:', error);
        if (window.UIHelpers) {
            UIHelpers.showError('An error occurred while saving.');
        } else {
            alert('An error occurred while saving.');
        }
    }
}

// ================= SETTINGS HANDLERS =================
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for settings toggles
    const settingsToggles = [
        'emailNotifications',
        'smsNotifications',
        'healthMonitoring',
        'dataSharing'
    ];

    settingsToggles.forEach(settingId => {
        const toggle = document.getElementById(settingId);
        if (toggle) {
            toggle.addEventListener('change', async (e) => {
                if (!userProfile.settings) userProfile.settings = {};
                userProfile.settings[settingId] = e.target.checked;
                await saveProfile();
            });
        }
    });
});

// ================= ACCOUNT ACTIONS =================
function changePassword() {
    const email = currentUser.email;
    if (confirm(`Send password reset email to ${email}?`)) {
        AuthService.resetPassword(email).then(result => {
            if (result.success) {
                alert('Password reset email sent! Check your inbox.');
            } else {
                alert('Failed to send password reset email.');
            }
        });
    }
}

function enable2FA() {
    alert('Two-factor authentication coming soon!');
}

function downloadData() {
    const dataStr = JSON.stringify(userProfile, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vital-x-profile-${currentUser.uid}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

async function deleteAccount() {
    if (confirm('⚠️ WARNING: This will permanently delete your account and all data. This cannot be undone. Are you sure?')) {
        if (confirm('Please confirm again: Delete all my data permanently?')) {
            try {
                // Delete user data
                await HealthDataService.deleteUserData(currentUser.uid);

                // Delete user document
                await db.collection('users').doc(currentUser.uid).delete();

                // Delete Firebase Auth account
                await currentUser.delete();

                alert('Account deleted successfully.');
                window.location.href = '../../../Index.html';
            } catch (error) {
                console.error('❌ Error deleting account:', error);
                alert('Failed to delete account. Please contact support.');
            }
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
    console.log('🔵 Profile page loading...');
    await checkAuthAndLoadProfile();
    console.log('✅ Profile page loaded');
});

// Make functions globally available
window.editPersonalInfo = editPersonalInfo;
window.editHealthInfo = editHealthInfo;
window.editMedicalHistory = editMedicalHistory;
window.editEmergencyContacts = editEmergencyContacts;
window.changeAvatar = changeAvatar;
window.editProfile = editProfile;
window.changePassword = changePassword;
window.enable2FA = enable2FA;
window.downloadData = downloadData;
window.deleteAccount = deleteAccount;
window.toggleSidebar = toggleSidebar;

console.log('💚 Profile Real-Time Integration loaded');