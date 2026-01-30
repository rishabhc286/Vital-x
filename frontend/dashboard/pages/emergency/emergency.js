// Emergency Page JavaScript

let monitoringInterval = null;
let isMonitoring = false;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadEmergencyContacts();
    loadMedicalInfo();
    updateHealthMetrics();
});

// Trigger Emergency Alert
function triggerEmergency() {
    const btn = document.getElementById('emergencyBtn');
    const status = document.getElementById('alertStatus');

    // Disable button temporarily
    btn.disabled = true;
    btn.style.opacity = '0.7';

    // Update status
    status.classList.add('active');
    status.innerHTML = '<span class="status-dot"></span><span>Alert Sent!</span>';

    // Get user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Send emergency alert
                sendEmergencyAlert(location);
            },
            function(error) {
                console.error('Location error:', error);
                sendEmergencyAlert(null);
            }
        );
    } else {
        sendEmergencyAlert(null);
    }

    // Re-enable button after 5 seconds
    setTimeout(() => {
        btn.disabled = false;
        btn.style.opacity = '1';
        status.classList.remove('active');
        status.innerHTML = '<span class="status-dot"></span><span>System Ready</span>';
    }, 5000);
}

// Send Emergency Alert
function sendEmergencyAlert(location) {
    const healthData = {
        heartRate: document.getElementById('heartRate').textContent,
        spo2: document.getElementById('spo2').textContent,
        bloodPressure: document.getElementById('bloodPressure').textContent,
        timestamp: new Date().toISOString()
    };

    // In a real application, this would send data to a backend
    console.log('Emergency Alert Sent:', {
        location,
        healthData,
        contacts: getEmergencyContacts()
    });

    // Add to alerts history
    addAlertToHistory('Emergency alert sent to contacts and services', 'danger');

    // Show notification
    showNotification('Emergency alert sent!', 'success');
}

// Call Emergency Services
function callEmergency(type) {
    let number;
    if (type === '911') {
        number = '911';
    } else if (type === 'poison') {
        number = '1-800-222-1222';
    }

    // In a real application, this would initiate a phone call
    window.location.href = `tel:${number}`;

    addAlertToHistory(`Called ${type === '911' ? '911' : 'Poison Control'}`, 'info');
}

// Share Location
function shareLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                // Create shareable link
                const mapUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`;

                // Share via Web Share API if available
                if (navigator.share) {
                    navigator.share({
                        title: 'My Location',
                        text: 'Emergency location share',
                        url: mapUrl
                    });
                } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(mapUrl);
                    showNotification('Location copied to clipboard!', 'success');
                }

                addAlertToHistory('Location shared with emergency contacts', 'success');
            },
            function(error) {
                console.error('Location error:', error);
                showNotification('Unable to get location', 'error');
            }
        );
    } else {
        showNotification('Geolocation not supported', 'error');
    }
}

// Show Medical Information
function showMedicalInfo() {
    // Scroll to medical info section
    const medicalSection = document.querySelector('.medical-info-section');
    if (medicalSection) {
        medicalSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Call Contact
function callContact(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
    addAlertToHistory(`Called contact`, 'info');
}

// Message Contact
function messageContact(phoneNumber) {
    window.location.href = `sms:${phoneNumber}`;
    addAlertToHistory(`Messaged contact`, 'info');
}

// Add Contact
function addContact() {
    const name = prompt('Enter contact name:');
    if (!name) return;

    const phone = prompt('Enter phone number:');
    if (!phone) return;

    // Add to contacts list
    const contactsList = document.getElementById('contactsList');
    const contactItem = document.createElement('div');
    contactItem.className = 'contact-item';

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

    contactItem.innerHTML = `
        <div class="contact-avatar">${initials}</div>
        <div class="contact-info">
            <h4>${name}</h4>
            <p>${phone}</p>
        </div>
        <div class="contact-actions">
            <button class="btn-call" onclick="callContact('${phone}')">📞</button>
            <button class="btn-msg" onclick="messageContact('${phone}')">💬</button>
        </div>
    `;

    contactsList.appendChild(contactItem);

    // Save to localStorage
    saveEmergencyContacts();

    showNotification('Contact added!', 'success');
}

// Load Emergency Contacts
function loadEmergencyContacts() {
    // In a real application, this would load from backend
    // For now, contacts are in HTML
}

// Get Emergency Contacts
function getEmergencyContacts() {
    const contacts = [];
    document.querySelectorAll('.contact-item').forEach(item => {
        const name = item.querySelector('.contact-info h4').textContent;
        const phone = item.querySelector('.contact-info p').textContent;
        contacts.push({ name, phone });
    });
    return contacts;
}

// Save Emergency Contacts
function saveEmergencyContacts() {
    const contacts = getEmergencyContacts();
    localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
}

// Start Monitoring
function startMonitoring() {
    if (isMonitoring) return;

    isMonitoring = true;
    showNotification('Health monitoring started', 'success');

    // Simulate real-time monitoring
    monitoringInterval = setInterval(() => {
        updateHealthMetrics();
    }, 5000); // Update every 5 seconds

    addAlertToHistory('Health monitoring started', 'info');
}

// Stop Monitoring
function stopMonitoring() {
    if (!isMonitoring) return;

    isMonitoring = false;
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
        monitoringInterval = null;
    }

    showNotification('Health monitoring stopped', 'info');
    addAlertToHistory('Health monitoring stopped', 'info');
}

// Update Health Metrics
function updateHealthMetrics() {
    // Simulate health data (in real app, this would come from sensors/API)
    const heartRate = 70 + Math.floor(Math.random() * 10);
    const spo2 = 96 + Math.floor(Math.random() * 4);
    const systolic = 110 + Math.floor(Math.random() * 20);
    const diastolic = 70 + Math.floor(Math.random() * 10);

    document.getElementById('heartRate').textContent = heartRate;
    document.getElementById('spo2').textContent = spo2;
    document.getElementById('bloodPressure').textContent = `${systolic}/${diastolic}`;

    // Update status indicators
    updateMetricStatus('heartRateStatus', heartRate, 60, 100);
    updateMetricStatus('spo2Status', spo2, 95, 100);
    updateMetricStatus('bpStatus', systolic, 90, 140);
}

// Update Metric Status
function updateMetricStatus(elementId, value, min, max) {
    const element = document.getElementById(elementId);
    const status = element.parentElement.querySelector('.metric-status');

    if (value < min || value > max) {
        status.className = 'metric-status danger';
        status.textContent = 'Alert';
    } else if (value < min * 1.1 || value > max * 0.9) {
        status.className = 'metric-status warning';
        status.textContent = 'Caution';
    } else {
        status.className = 'metric-status safe';
        status.textContent = 'Normal';
    }
}

// Load Medical Info
function loadMedicalInfo() {
    // In a real application, this would load from backend
    const medicalInfo = JSON.parse(localStorage.getItem('medicalInfo')) || {
        bloodType: 'O+',
        allergies: 'None known',
        medications: 'None',
        conditions: 'None',
        emergencyContact: 'John Doe - +1 (555) 123-4567'
    };

    document.getElementById('bloodType').textContent = medicalInfo.bloodType;
    document.getElementById('allergies').textContent = medicalInfo.allergies;
    document.getElementById('medications').textContent = medicalInfo.medications;
    document.getElementById('conditions').textContent = medicalInfo.conditions;
    document.getElementById('emergencyContact').textContent = medicalInfo.emergencyContact;
}

// Edit Medical Info
function editMedicalInfo() {
    const bloodType = prompt('Blood Type:', document.getElementById('bloodType').textContent) || document.getElementById('bloodType').textContent;
    const allergies = prompt('Allergies:', document.getElementById('allergies').textContent) || document.getElementById('allergies').textContent;
    const medications = prompt('Medications:', document.getElementById('medications').textContent) || document.getElementById('medications').textContent;
    const conditions = prompt('Medical Conditions:', document.getElementById('conditions').textContent) || document.getElementById('conditions').textContent;
    const emergencyContact = prompt('Emergency Contact:', document.getElementById('emergencyContact').textContent) || document.getElementById('emergencyContact').textContent;

    const medicalInfo = {
        bloodType,
        allergies,
        medications,
        conditions,
        emergencyContact
    };

    document.getElementById('bloodType').textContent = bloodType;
    document.getElementById('allergies').textContent = allergies;
    document.getElementById('medications').textContent = medications;
    document.getElementById('conditions').textContent = conditions;
    document.getElementById('emergencyContact').textContent = emergencyContact;

    localStorage.setItem('medicalInfo', JSON.stringify(medicalInfo));
    showNotification('Medical information updated!', 'success');
}

// Add Alert to History
function addAlertToHistory(message, type) {
    const alertsList = document.getElementById('alertsList');
    const alertItem = document.createElement('div');
    alertItem.className = 'alert-item';

    const time = new Date().toLocaleTimeString();
    const timeAgo = 'Just now';

    alertItem.innerHTML = `
        <div class="alert-time">${timeAgo}</div>
        <div class="alert-message">${message}</div>
        <div class="alert-type ${type}">${type}</div>
    `;

    alertsList.insertBefore(alertItem, alertsList.firstChild);

    // Keep only last 10 alerts
    while (alertsList.children.length > 10) {
        alertsList.removeChild(alertsList.lastChild);
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
