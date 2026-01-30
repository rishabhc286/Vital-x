// Body Health Page JavaScript with Three.js 3D Model

let scene, camera, renderer, controls;
let bodyParts = {};
let selectedPart = null;
let smokingData = {
    isSmoker: false,
    years: 0,
    cigarettesPerDay: 0
};

// Health status colors
const healthColors = {
    healthy: 0x22c55e,    // Green
    caution: 0xeab308,    // Yellow
    warning: 0xf97316,    // Orange
    critical: 0xef4444    // Red
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadSmokingData();
    init3DModel();
    updateStatusList();
    updateLifestyleDisplay();
    animate();
});

// Initialize 3D Model
function init3DModel() {
    const container = document.getElementById('modelContainer');
    if (!container) return;

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);

    // Camera
    camera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Controls (simplified if OrbitControls not available)
    try {
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 8;
            controls.maxDistance = 25;
        } else {
            // Fallback: simple mouse controls
            controls = createSimpleControls(camera, renderer.domElement);
        }
    } catch (e) {
        console.warn('OrbitControls not available, using fallback:', e);
        controls = createSimpleControls(camera, renderer.domElement);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 10, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    // Create body parts
    createBodyModel();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Handle clicks
    renderer.domElement.addEventListener('click', onModelClick);
}

// Create Body Model
function createBodyModel() {
    // Head
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.2
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 6, 0);
    head.userData = { part: 'head', name: 'Head' };
    scene.add(head);
    bodyParts.head = head;

    // Torso
    const torsoGeometry = new THREE.BoxGeometry(2, 4, 1);
    const torsoMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.2
    });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.set(0, 2, 0);
    torso.userData = { part: 'torso', name: 'Torso' };
    scene.add(torso);
    bodyParts.torso = torso;

    // Heart
    const heartGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const heartMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.5
    });
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.position.set(0.5, 3, 0.6);
    heart.userData = { part: 'heart', name: 'Heart' };
    scene.add(heart);
    bodyParts.heart = heart;

    // Left Lung
    const leftLungGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.8);
    const leftLungMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.4
    });
    const leftLung = new THREE.Mesh(leftLungGeometry, leftLungMaterial);
    leftLung.position.set(-0.6, 2.5, 0.6);
    leftLung.userData = { part: 'leftLung', name: 'Left Lung' };
    scene.add(leftLung);
    bodyParts.leftLung = leftLung;

    // Right Lung
    const rightLungGeometry = new THREE.BoxGeometry(0.4, 1.2, 0.8);
    const rightLungMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.4
    });
    const rightLung = new THREE.Mesh(rightLungGeometry, rightLungMaterial);
    rightLung.position.set(0.6, 2.5, 0.6);
    rightLung.userData = { part: 'rightLung', name: 'Right Lung' };
    scene.add(rightLung);
    bodyParts.rightLung = rightLung;

    // Left Arm
    const leftArmGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const leftArmMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.2
    });
    const leftArm = new THREE.Mesh(leftArmGeometry, leftArmMaterial);
    leftArm.position.set(-1.5, 1, 0);
    leftArm.rotation.z = Math.PI / 6;
    leftArm.userData = { part: 'leftArm', name: 'Left Arm' };
    scene.add(leftArm);
    bodyParts.leftArm = leftArm;

    // Right Arm
    const rightArmGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 16);
    const rightArmMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.2
    });
    const rightArm = new THREE.Mesh(rightArmGeometry, rightArmMaterial);
    rightArm.position.set(1.5, 1, 0);
    rightArm.rotation.z = -Math.PI / 6;
    rightArm.userData = { part: 'rightArm', name: 'Right Arm' };
    scene.add(rightArm);
    bodyParts.rightArm = rightArm;

    // Left Leg
    const leftLegGeometry = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 16);
    const leftLegMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.2
    });
    const leftLeg = new THREE.Mesh(leftLegGeometry, leftLegMaterial);
    leftLeg.position.set(-0.6, -2, 0);
    leftLeg.userData = { part: 'leftLeg', name: 'Left Leg' };
    scene.add(leftLeg);
    bodyParts.leftLeg = leftLeg;

    // Right Leg
    const rightLegGeometry = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 16);
    const rightLegMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.2
    });
    const rightLeg = new THREE.Mesh(rightLegGeometry, rightLegMaterial);
    rightLeg.position.set(0.6, -2, 0);
    rightLeg.userData = { part: 'rightLeg', name: 'Right Leg' };
    scene.add(rightLeg);
    bodyParts.rightLeg = rightLeg;

    // Update lung colors based on smoking
    updateLungHealth();
}

// Update Lung Health Based on Smoking
function updateLungHealth() {
    if (!smokingData.isSmoker) {
        setBodyPartHealth('leftLung', 'healthy');
        setBodyPartHealth('rightLung', 'healthy');
        return;
    }

    // Calculate health impact based on smoking
    const totalCigarettes = smokingData.years * 365 * smokingData.cigarettesPerDay;
    let healthStatus;

    if (totalCigarettes < 10000) {
        healthStatus = 'caution'; // Yellow
    } else if (totalCigarettes < 50000) {
        healthStatus = 'warning'; // Orange
    } else {
        healthStatus = 'critical'; // Red
    }

    // Additional factor: cigarettes per day
    if (smokingData.cigarettesPerDay > 20) {
        if (healthStatus === 'caution') healthStatus = 'warning';
        else if (healthStatus === 'warning') healthStatus = 'critical';
    }

    setBodyPartHealth('leftLung', healthStatus);
    setBodyPartHealth('rightLung', healthStatus);

    // Update display
    const statusText = healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1);
    document.getElementById('lungHealthStatus').textContent = statusText;
    document.getElementById('lungHealthStatus').className = 'metric-value ' + healthStatus;

    // Update impact text
    let impactText = 'None';
    if (healthStatus === 'caution') impactText = 'Mild';
    else if (healthStatus === 'warning') impactText = 'Moderate';
    else if (healthStatus === 'critical') impactText = 'Severe';
    document.getElementById('lungImpact').textContent = impactText;
}

// Set Body Part Health
function setBodyPartHealth(partName, status) {
    const part = bodyParts[partName];
    if (!part) return;

    const color = healthColors[status];
    part.material.color.setHex(color);
    part.material.emissive.setHex(color);
    part.userData.status = status;
}

// Handle Model Click
function onModelClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(Object.values(bodyParts));

    if (intersects.length > 0) {
        const selected = intersects[0].object;
        selectBodyPart(selected.userData.part);
    }
}

// Select Body Part
function selectBodyPart(partName) {
    // Remove previous selection highlight
    if (selectedPart) {
        selectedPart.material.emissiveIntensity =
            selectedPart.userData.status === 'healthy' ? 0.2 : 0.4;
    }

    selectedPart = bodyParts[partName];
    if (selectedPart) {
        // Highlight selected part
        selectedPart.material.emissiveIntensity = 0.8;
        showBodyPartDetails(selectedPart.userData);
    }

    // Update status list
    updateStatusList();
}

// Show Body Part Details
function showBodyPartDetails(partData) {
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsContent = document.getElementById('detailsContent');

    detailsTitle.textContent = partData.name + ' Health';

    const status = partData.status || 'healthy';
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);

    let detailsHTML = `
        <div class="details-info">
            <div class="detail-section">
                <h4>Health Status</h4>
                <p>Current status: <strong style="color: ${getStatusColor(status)}">${statusText}</strong></p>
            </div>
    `;

    // Specific details for each body part
    if (partData.part === 'heart') {
        detailsHTML += `
            <div class="detail-section">
                <h4>Heart Metrics</h4>
                <div class="detail-metrics">
                    <div class="detail-metric">
                        <span class="detail-metric-label">Heart Rate</span>
                        <span class="detail-metric-value">72 bpm</span>
                    </div>
                    <div class="detail-metric">
                        <span class="detail-metric-label">Blood Pressure</span>
                        <span class="detail-metric-value">120/80</span>
                    </div>
                </div>
                <p style="margin-top: 12px;">Your heart is functioning normally. Continue maintaining a healthy lifestyle.</p>
            </div>
        `;
    } else if (partData.part === 'leftLung' || partData.part === 'rightLung') {
        const lungImpact = document.getElementById('lungImpact').textContent;
        detailsHTML += `
            <div class="detail-section">
                <h4>Lung Health</h4>
                <div class="detail-metrics">
                    <div class="detail-metric">
                        <span class="detail-metric-label">SpO2</span>
                        <span class="detail-metric-value">98%</span>
                    </div>
                    <div class="detail-metric">
                        <span class="detail-metric-label">Impact Level</span>
                        <span class="detail-metric-value">${lungImpact}</span>
                    </div>
                </div>
                <p style="margin-top: 12px;">
                    ${smokingData.isSmoker
            ? `Based on your smoking history (${smokingData.years} years, ${smokingData.cigarettesPerDay} cigarettes/day), your lungs show ${statusText.toLowerCase()} health impact. Consider reducing or quitting smoking.`
            : 'Your lungs are healthy. Maintain good respiratory health by avoiding smoking and pollutants.'}
                </p>
            </div>
        `;
    } else {
        detailsHTML += `
            <div class="detail-section">
                <h4>General Information</h4>
                <p>This body part is currently in ${statusText.toLowerCase()} condition. Monitor regularly for any changes.</p>
            </div>
        `;
    }

    detailsHTML += '</div>';
    detailsContent.innerHTML = detailsHTML;
}

// Get Status Color
function getStatusColor(status) {
    const colors = {
        healthy: '#22c55e',
        caution: '#eab308',
        warning: '#f97316',
        critical: '#ef4444'
    };
    return colors[status] || colors.healthy;
}

// Update Status List
function updateStatusList() {
    const statusList = document.getElementById('statusList');
    statusList.innerHTML = '';

    const partIcons = {
        head: '🧠',
        torso: '🫁',
        heart: '❤️',
        leftLung: '🫁',
        rightLung: '🫁',
        leftArm: '💪',
        rightArm: '💪',
        leftLeg: '🦵',
        rightLeg: '🦵'
    };

    Object.keys(bodyParts).forEach(partName => {
        const part = bodyParts[partName];
        const status = part.userData.status || 'healthy';
        const isSelected = selectedPart === part;

        const item = document.createElement('div');
        item.className = `status-item ${isSelected ? 'active' : ''}`;
        item.onclick = () => selectBodyPart(partName);

        item.innerHTML = `
            <div class="status-part">
                <span class="status-icon">${partIcons[partName] || '🔵'}</span>
                <span class="status-name">${part.userData.name}</span>
            </div>
            <span class="status-indicator ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
        `;

        statusList.appendChild(item);
    });
}

// Load Smoking Data
function loadSmokingData() {
    const saved = localStorage.getItem('smokingData');
    if (saved) {
        smokingData = JSON.parse(saved);
    }
}

// Save Smoking Data
function saveSmokingData() {
    localStorage.setItem('smokingData', JSON.stringify(smokingData));
}

// Update Lifestyle Display
function updateLifestyleDisplay() {
    document.getElementById('smokingStatus').textContent =
        smokingData.isSmoker ? 'Smoker' : 'Non-smoker';
    document.getElementById('smokingYears').textContent =
        smokingData.years + ' years';
    document.getElementById('cigarettesPerDay').textContent =
        smokingData.cigarettesPerDay;
}

// Edit Smoking Status
function editSmokingStatus() {
    const isSmoker = confirm('Are you a smoker?');
    smokingData.isSmoker = isSmoker;

    if (isSmoker) {
        const years = prompt('How many years have you been smoking?', smokingData.years || '0');
        const perDay = prompt('How many cigarettes per day?', smokingData.cigarettesPerDay || '0');

        smokingData.years = parseInt(years) || 0;
        smokingData.cigarettesPerDay = parseInt(perDay) || 0;
    } else {
        smokingData.years = 0;
        smokingData.cigarettesPerDay = 0;
    }

    saveSmokingData();
    updateLifestyleDisplay();
    updateLungHealth();
    showNotification('Smoking data updated!', 'success');
}

// Create Simple Controls (fallback)
function createSimpleControls(camera, domElement) {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let cameraAngle = { theta: 0, phi: Math.PI / 3 };
    let cameraDistance = 15;

    domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    domElement.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        // Update angles
        cameraAngle.theta -= deltaX * 0.01;
        cameraAngle.phi += deltaY * 0.01;
        cameraAngle.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraAngle.phi));

        // Update camera position
        camera.position.x = cameraDistance * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
        camera.position.y = cameraDistance * Math.cos(cameraAngle.phi);
        camera.position.z = cameraDistance * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
        camera.lookAt(0, 0, 0);

        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });

    domElement.addEventListener('wheel', (e) => {
        const delta = e.deltaY * 0.01;
        cameraDistance = Math.max(8, Math.min(25, cameraDistance + delta));

        // Update camera position
        camera.position.x = cameraDistance * Math.sin(cameraAngle.phi) * Math.cos(cameraAngle.theta);
        camera.position.y = cameraDistance * Math.cos(cameraAngle.phi);
        camera.position.z = cameraDistance * Math.sin(cameraAngle.phi) * Math.sin(cameraAngle.theta);
        camera.lookAt(0, 0, 0);
    });

    return {
        update: () => {},
        reset: () => {
            camera.position.set(0, 5, 15);
            camera.lookAt(0, 0, 0);
            cameraAngle = { theta: 0, phi: Math.PI / 3 };
            cameraDistance = 15;
        }
    };
}

// Reset View
function resetView() {
    if (camera && controls) {
        camera.position.set(0, 5, 15);
        camera.lookAt(0, 0, 0);
        if (controls.reset) {
            controls.reset();
        }
    }
}

// Toggle Fullscreen
function toggleFullscreen() {
    const container = document.getElementById('modelContainer');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Handle Window Resize
function onWindowResize() {
    const container = document.getElementById('modelContainer');
    if (!container || !camera || !renderer) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Animate
function animate() {
    requestAnimationFrame(animate);

    if (controls) {
        controls.update();
    }

    // Subtle animation for body parts
    Object.values(bodyParts).forEach(part => {
        if (part.userData.part === 'heart') {
            part.rotation.y += 0.01;
        }
    });

    if (renderer && scene && camera) {
        renderer.render(scene, camera);
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
`;
document.head.appendChild(style);

