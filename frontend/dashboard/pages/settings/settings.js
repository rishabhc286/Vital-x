// Settings Page JavaScript

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // All toggles and selects will auto-save on change
    document.querySelectorAll('.toggle-switch input, .setting-select').forEach(element => {
        element.addEventListener('change', saveSettings);
    });
}

// Load Settings
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('appSettings')) || {
        language: 'en',
        theme: 'dark',
        dateFormat: 'mm/dd/yyyy',
        timeFormat: '12',
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        healthAlerts: true,
        medicationReminders: true,
        activityReminders: false,
        dataSharing: false,
        locationServices: true,
        autoMonitoring: true,
        monitoringFrequency: 'realtime',
        emergencyDetection: true,
        healthScoreMethod: 'comprehensive',
        dataRetention: 'forever'
    };

    // Apply settings to UI
    if (document.getElementById('language')) document.getElementById('language').value = settings.language;
    if (document.getElementById('theme')) document.getElementById('theme').value = settings.theme;
    if (document.getElementById('dateFormat')) document.getElementById('dateFormat').value = settings.dateFormat;
    if (document.getElementById('timeFormat')) document.getElementById('timeFormat').value = settings.timeFormat;
    if (document.getElementById('emailNotifications')) document.getElementById('emailNotifications').checked = settings.emailNotifications;
    if (document.getElementById('smsNotifications')) document.getElementById('smsNotifications').checked = settings.smsNotifications;
    if (document.getElementById('pushNotifications')) document.getElementById('pushNotifications').checked = settings.pushNotifications;
    if (document.getElementById('healthAlerts')) document.getElementById('healthAlerts').checked = settings.healthAlerts;
    if (document.getElementById('medicationReminders')) document.getElementById('medicationReminders').checked = settings.medicationReminders;
    if (document.getElementById('activityReminders')) document.getElementById('activityReminders').checked = settings.activityReminders;
    if (document.getElementById('dataSharing')) document.getElementById('dataSharing').checked = settings.dataSharing;
    if (document.getElementById('locationServices')) document.getElementById('locationServices').checked = settings.locationServices;
    if (document.getElementById('autoMonitoring')) document.getElementById('autoMonitoring').checked = settings.autoMonitoring;
    if (document.getElementById('monitoringFrequency')) document.getElementById('monitoringFrequency').value = settings.monitoringFrequency;
    if (document.getElementById('emergencyDetection')) document.getElementById('emergencyDetection').checked = settings.emergencyDetection;
    if (document.getElementById('healthScoreMethod')) document.getElementById('healthScoreMethod').value = settings.healthScoreMethod;
    if (document.getElementById('dataRetention')) document.getElementById('dataRetention').value = settings.dataRetention;
}

// Save Settings
function saveSettings() {
    const settings = {
        language: document.getElementById('language').value,
        theme: document.getElementById('theme').value,
        dateFormat: document.getElementById('dateFormat').value,
        timeFormat: document.getElementById('timeFormat').value,
        emailNotifications: document.getElementById('emailNotifications').checked,
        smsNotifications: document.getElementById('smsNotifications').checked,
        pushNotifications: document.getElementById('pushNotifications').checked,
        healthAlerts: document.getElementById('healthAlerts').checked,
        medicationReminders: document.getElementById('medicationReminders').checked,
        activityReminders: document.getElementById('activityReminders').checked,
        dataSharing: document.getElementById('dataSharing').checked,
        locationServices: document.getElementById('locationServices').checked,
        autoMonitoring: document.getElementById('autoMonitoring').checked,
        monitoringFrequency: document.getElementById('monitoringFrequency').value,
        emergencyDetection: document.getElementById('emergencyDetection').checked,
        healthScoreMethod: document.getElementById('healthScoreMethod').value,
        dataRetention: document.getElementById('dataRetention').value
    };

    localStorage.setItem('appSettings', JSON.stringify(settings));
    showNotification('Settings saved successfully!', 'success');
}

// Enable 2FA
function enable2FA() {
    if (confirm('Enable Two-Factor Authentication? This will add an extra layer of security to your account.')) {
        // In a real app, this would initiate 2FA setup
        showNotification('Two-Factor Authentication enabled!', 'success');
    }
}

// Change Password
function changePassword() {
    const currentPassword = prompt('Enter current password:');
    if (!currentPassword) return;

    const newPassword = prompt('Enter new password:');
    if (!newPassword) return;

    const confirmPassword = prompt('Confirm new password:');
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // In a real app, this would send to backend
    showNotification('Password changed successfully!', 'success');
}

// View Login History
function viewLoginHistory() {
    // In a real app, this would show login history
    alert('Login History:\n\n• Today, 2:30 PM - Chrome, Windows\n• Yesterday, 10:15 AM - Safari, iOS\n• 2 days ago, 8:45 AM - Chrome, Windows');
}

// Manage Device
function manageDevice(deviceType) {
    alert(`Managing ${deviceType} device...\n\nIn a real application, this would open device management settings.`);
}

// Add Device
function addDevice() {
    const deviceType = prompt('Enter device type (e.g., Blood Pressure Monitor, Scale, etc.):');
    if (deviceType) {
        showNotification(`Adding ${deviceType}...`, 'info');
        // In a real app, this would initiate device pairing
    }
}

// Export Data
function exportData() {
    if (confirm('Export all your health data? This may take a few moments.')) {
        // In a real app, this would generate and download data
        const data = {
            profile: JSON.parse(localStorage.getItem('profileData') || '{}'),
            settings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
            timestamp: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `vital-x-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        showNotification('Data exported successfully!', 'success');
    }
}

// Backup Data
function backupData() {
    if (confirm('Create a backup of your data?')) {
        // In a real app, this would create a backup
        showNotification('Backup created successfully!', 'success');
    }
}

// Clear Cache
function clearCache() {
    if (confirm('Clear cached data? This will free up space but may slow down initial loading.')) {
        // Clear localStorage cache (but keep important data)
        const importantKeys = ['appSettings', 'profileData', 'smokingData'];
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && !importantKeys.includes(key) && key.startsWith('cache_')) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
        showNotification('Cache cleared successfully!', 'success');
    }
}

// Deactivate Account
function deactivateAccount() {
    if (confirm('Deactivate your account? You can reactivate it later by logging in.')) {
        const finalConfirm = prompt('Type "DEACTIVATE" to confirm:');
        if (finalConfirm === 'DEACTIVATE') {
            // In a real app, this would deactivate the account
            showNotification('Account deactivated. You can reactivate by logging in.', 'info');
        }
    }
}

// Delete Account
function deleteAccount() {
    if (confirm('⚠️ WARNING: This will permanently delete your account and all data. This action cannot be undone!')) {
        const finalConfirm = prompt('Type "DELETE" to confirm:');
        if (finalConfirm === 'DELETE') {
            // In a real app, this would delete the account
            showNotification('Account deletion requested. You will receive a confirmation email.', 'info');
        }
    }
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        background: linear-gradient(135deg, rgba(15,23,42,0.95), rgba(15,23,42,0.9));
        border: 1px solid var(--border-glass);
        border-radius: 12px;
        backdrop-filter: blur(18px);
        box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        z-index: 1000;
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
    }
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    .notification-success {
        border-left: 4px solid var(--success);
    }
    .notification-error {
        border-left: 4px solid var(--danger);
    }
    .notification-info {
        border-left: 4px solid var(--accent);
    }
`;
document.head.appendChild(style);

