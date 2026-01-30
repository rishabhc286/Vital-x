// System Switcher for 3D Body Health
// Handles switching between different body systems

// System visibility states
let systemStates = {
    organs: true,
    skeletal: false,
    muscular: false,
    circulatory: false,
    nervous: false
};

// Switch to a specific system
function switchSystem(systemName) {
    console.log('Switching to system:', systemName);

    // Update button states
    document.querySelectorAll('.system-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-system') === systemName) {
            btn.classList.add('active');
        }
    });

    // Update system states
    Object.keys(systemStates).forEach(key => {
        systemStates[key] = (key === systemName);
    });

    // Apply visual changes to the 3D model
    applySystemFilter(systemName);
}

// Apply system filter to the 3D model
function applySystemFilter(systemName) {
    if (!bodyModel) {
        console.warn('Body model not loaded yet');
        return;
    }

    // Traverse the model and show/hide parts based on system
    bodyModel.traverse((child) => {
        if (child.isMesh) {
            const childName = child.name.toLowerCase();
            let shouldShow = true;

            switch (systemName) {
                case 'organs':
                    // Show all internal organs
                    shouldShow = childName.includes('heart') ||
                        childName.includes('lung') ||
                        childName.includes('liver') ||
                        childName.includes('kidney') ||
                        childName.includes('stomach') ||
                        childName.includes('brain') ||
                        childName.includes('body') ||
                        childName.includes('torso');
                    break;

                case 'skeletal':
                    // Show bones and skeletal structure
                    shouldShow = childName.includes('bone') ||
                        childName.includes('skeleton') ||
                        childName.includes('skull') ||
                        childName.includes('rib') ||
                        childName.includes('spine');
                    break;

                case 'muscular':
                    // Show muscles
                    shouldShow = childName.includes('muscle') ||
                        childName.includes('arm') ||
                        childName.includes('leg') ||
                        childName.includes('torso');
                    break;

                case 'circulatory':
                    // Show heart and blood vessels
                    shouldShow = childName.includes('heart') ||
                        childName.includes('vein') ||
                        childName.includes('artery') ||
                        childName.includes('blood');
                    break;

                case 'nervous':
                    // Show brain and nervous system
                    shouldShow = childName.includes('brain') ||
                        childName.includes('nerve') ||
                        childName.includes('spinal');
                    break;

                default:
                    shouldShow = true;
            }

            // Apply visibility
            child.visible = shouldShow;

            // Adjust opacity for better visualization
            if (child.material && shouldShow) {
                if (child.material.opacity !== undefined) {
                    child.material.opacity = 1.0;
                    child.material.transparent = false;
                }
            }
        }
    });

    // Update status panel based on system
    updateSystemStatus(systemName);
}

// Update status panel for the selected system
function updateSystemStatus(systemName) {
    const statusList = document.getElementById('statusList');
    if (!statusList) return;

    let parts = [];

    switch (systemName) {
        case 'organs':
            parts = [
                { name: 'Brain', status: 'healthy', icon: '🧠' },
                { name: 'Heart', status: 'healthy', icon: '❤️' },
                { name: 'Lungs', status: smokingData.isSmoker ? 'caution' : 'healthy', icon: '🫁' },
                { name: 'Liver', status: 'healthy', icon: '🫀' },
                { name: 'Kidneys', status: 'healthy', icon: '🫘' },
                { name: 'Stomach', status: 'healthy', icon: '🫃' }
            ];
            break;

        case 'skeletal':
            parts = [
                { name: 'Skull', status: 'healthy', icon: '💀' },
                { name: 'Spine', status: 'healthy', icon: '🦴' },
                { name: 'Ribs', status: 'healthy', icon: '🦴' },
                { name: 'Pelvis', status: 'healthy', icon: '🦴' },
                { name: 'Limbs', status: 'healthy', icon: '🦴' }
            ];
            break;

        case 'muscular':
            parts = [
                { name: 'Chest Muscles', status: 'healthy', icon: '💪' },
                { name: 'Arm Muscles', status: 'healthy', icon: '💪' },
                { name: 'Leg Muscles', status: 'healthy', icon: '💪' },
                { name: 'Core Muscles', status: 'healthy', icon: '💪' },
                { name: 'Back Muscles', status: 'healthy', icon: '💪' }
            ];
            break;

        case 'circulatory':
            parts = [
                { name: 'Heart', status: 'healthy', icon: '❤️' },
                { name: 'Arteries', status: 'healthy', icon: '🩸' },
                { name: 'Veins', status: 'healthy', icon: '🩸' },
                { name: 'Blood Pressure', status: 'healthy', icon: '🩺' }
            ];
            break;

        case 'nervous':
            parts = [
                { name: 'Brain', status: 'healthy', icon: '🧠' },
                { name: 'Spinal Cord', status: 'healthy', icon: '🧬' },
                { name: 'Nerves', status: 'healthy', icon: '⚡' },
                { name: 'Reflexes', status: 'healthy', icon: '⚡' }
            ];
            break;
    }

    statusList.innerHTML = parts.map(part => `
        <div class="status-item">
            <span class="status-icon">${part.icon}</span>
            <span class="status-name">${part.name}</span>
            <span class="status-badge ${part.status}">${part.status}</span>
        </div>
    `).join('');
}

// Initialize system switcher
document.addEventListener('DOMContentLoaded', function () {
    // Set default system
    setTimeout(() => {
        switchSystem('organs');
    }, 1000); // Wait for model to load
});
