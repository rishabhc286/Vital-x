// Enhanced Body Health Page JavaScript with Improved 3D Model

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
document.addEventListener('DOMContentLoaded', function () {
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

    // Add fog for depth
    scene.fog = new THREE.Fog(0x020617, 10, 50);

    // Camera
    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 8, 20);
    camera.lookAt(0, 5, 0);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Controls
    try {
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 10;
            controls.maxDistance = 35;
            controls.target.set(0, 5, 0);
        } else {
            controls = createSimpleControls(camera, renderer.domElement);
        }
    } catch (e) {
        console.warn('OrbitControls not available, using fallback:', e);
        controls = createSimpleControls(camera, renderer.domElement);
    }

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 15, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x2dd4bf, 0.3);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0x22d3ee, 0.4);
    backLight.position.set(0, 5, -15);
    scene.add(backLight);

    // Add point lights for glow effect
    const glowLight1 = new THREE.PointLight(0x2dd4bf, 0.5, 20);
    glowLight1.position.set(5, 8, 5);
    scene.add(glowLight1);

    const glowLight2 = new THREE.PointLight(0x22d3ee, 0.5, 20);
    glowLight2.position.set(-5, 8, 5);
    scene.add(glowLight2);

    // Create enhanced body model
    createEnhancedBodyModel();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Handle clicks
    renderer.domElement.addEventListener('click', onModelClick);
}

// Create Enhanced Body Model
function createEnhancedBodyModel() {
    // === HEAD & BRAIN ===
    const headGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd7b5,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.1,
        roughness: 0.7,
        metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 8.5, 0);
    head.castShadow = true;
    head.userData = { part: 'head', name: 'Head' };
    scene.add(head);
    bodyParts.head = head;

    // Brain (visible through semi-transparent head)
    const brainGeometry = new THREE.SphereGeometry(0.9, 32, 32);
    const brainMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.4,
        transparent: true,
        opacity: 0.8,
        roughness: 0.5
    });
    const brain = new THREE.Mesh(brainGeometry, brainMaterial);
    brain.position.set(0, 8.7, 0);
    brain.userData = { part: 'brain', name: 'Brain' };
    scene.add(brain);
    bodyParts.brain = brain;

    // === NECK ===
    const neckGeometry = new THREE.CylinderGeometry(0.5, 0.6, 1.5, 16);
    const neckMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd7b5,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.1,
        roughness: 0.7
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.set(0, 7, 0);
    neck.castShadow = true;
    neck.userData = { part: 'neck', name: 'Neck' };
    scene.add(neck);
    bodyParts.neck = neck;

    // === TORSO (More detailed) ===
    const torsoGeometry = new THREE.BoxGeometry(3, 5, 1.5);
    // Round the edges
    torsoGeometry.parameters = { ...torsoGeometry.parameters, bevelEnabled: true };
    const torsoMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd7b5,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.1,
        roughness: 0.7
    });
    const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
    torso.position.set(0, 3.5, 0);
    torso.castShadow = true;
    torso.userData = { part: 'torso', name: 'Torso' };
    scene.add(torso);
    bodyParts.torso = torso;

    // === HEART (More detailed) ===
    const heartGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const heartMaterial = new THREE.MeshStandardMaterial({
        color: 0xff4444,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.9,
        roughness: 0.3,
        metalness: 0.2
    });
    const heart = new THREE.Mesh(heartGeometry, heartMaterial);
    heart.position.set(-0.3, 4.5, 1);
    heart.scale.set(1, 1.2, 0.8);
    heart.userData = { part: 'heart', name: 'Heart' };
    scene.add(heart);
    bodyParts.heart = heart;

    // === LUNGS (More realistic shape) ===
    // Left Lung
    const leftLungGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const leftLungMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.85,
        roughness: 0.6
    });
    const leftLung = new THREE.Mesh(leftLungGeometry, leftLungMaterial);
    leftLung.position.set(-0.9, 4.2, 0.8);
    leftLung.scale.set(0.8, 1.3, 0.9);
    leftLung.userData = { part: 'leftLung', name: 'Left Lung' };
    scene.add(leftLung);
    bodyParts.leftLung = leftLung;

    // Right Lung
    const rightLungGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const rightLungMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.85,
        roughness: 0.6
    });
    const rightLung = new THREE.Mesh(rightLungGeometry, rightLungMaterial);
    rightLung.position.set(0.9, 4.2, 0.8);
    rightLung.scale.set(0.8, 1.3, 0.9);
    rightLung.userData = { part: 'rightLung', name: 'Right Lung' };
    scene.add(rightLung);
    bodyParts.rightLung = rightLung;

    // === STOMACH ===
    const stomachGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const stomachMaterial = new THREE.MeshStandardMaterial({
        color: healthColors.healthy,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
        roughness: 0.7
    });
    const stomach = new THREE.Mesh(stomachGeometry, stomachMaterial);
    stomach.position.set(-0.5, 2.5, 1);
    stomach.scale.set(1.2, 1, 0.8);
    stomach.userData = { part: 'stomach', name: 'Stomach' };
    scene.add(stomach);
    bodyParts.stomach = stomach;

    // === LIVER ===
    const liverGeometry = new THREE.BoxGeometry(1, 0.8, 0.6);
    const liverMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
        roughness: 0.6
    });
    const liver = new THREE.Mesh(liverGeometry, liverMaterial);
    liver.position.set(0.7, 2.8, 0.9);
    liver.userData = { part: 'liver', name: 'Liver' };
    scene.add(liver);
    bodyParts.liver = liver;

    // === KIDNEYS ===
    // Left Kidney
    const leftKidneyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const leftKidneyMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
    });
    const leftKidney = new THREE.Mesh(leftKidneyGeometry, leftKidneyMaterial);
    leftKidney.position.set(-1, 2, 0.2);
    leftKidney.scale.set(0.8, 1.2, 0.6);
    leftKidney.userData = { part: 'leftKidney', name: 'Left Kidney' };
    scene.add(leftKidney);
    bodyParts.leftKidney = leftKidney;

    // Right Kidney
    const rightKidneyGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const rightKidneyMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8
    });
    const rightKidney = new THREE.Mesh(rightKidneyGeometry, rightKidneyMaterial);
    rightKidney.position.set(1, 2, 0.2);
    rightKidney.scale.set(0.8, 1.2, 0.6);
    rightKidney.userData = { part: 'rightKidney', name: 'Right Kidney' };
    scene.add(rightKidney);
    bodyParts.rightKidney = rightKidney;

    // === ARMS (More detailed) ===
    // Left Shoulder
    const leftShoulderGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const shoulderMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd7b5,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.1,
        roughness: 0.7
    });
    const leftShoulder = new THREE.Mesh(leftShoulderGeometry, shoulderMaterial);
    leftShoulder.position.set(-1.8, 5.5, 0);
    leftShoulder.castShadow = true;
    scene.add(leftShoulder);

    // Left Upper Arm
    const leftUpperArmGeometry = new THREE.CylinderGeometry(0.4, 0.35, 2, 16);
    const leftUpperArm = new THREE.Mesh(leftUpperArmGeometry, shoulderMaterial.clone());
    leftUpperArm.position.set(-2.2, 4, 0);
    leftUpperArm.rotation.z = Math.PI / 8;
    leftUpperArm.castShadow = true;
    leftUpperArm.userData = { part: 'leftArm', name: 'Left Arm' };
    scene.add(leftUpperArm);
    bodyParts.leftArm = leftUpperArm;

    // Left Forearm
    const leftForearmGeometry = new THREE.CylinderGeometry(0.35, 0.3, 2, 16);
    const leftForearm = new THREE.Mesh(leftForearmGeometry, shoulderMaterial.clone());
    leftForearm.position.set(-2.5, 2.2, 0);
    leftForearm.rotation.z = Math.PI / 10;
    leftForearm.castShadow = true;
    scene.add(leftForearm);

    // Right Shoulder
    const rightShoulder = new THREE.Mesh(leftShoulderGeometry, shoulderMaterial.clone());
    rightShoulder.position.set(1.8, 5.5, 0);
    rightShoulder.castShadow = true;
    scene.add(rightShoulder);

    // Right Upper Arm
    const rightUpperArm = new THREE.Mesh(leftUpperArmGeometry, shoulderMaterial.clone());
    rightUpperArm.position.set(2.2, 4, 0);
    rightUpperArm.rotation.z = -Math.PI / 8;
    rightUpperArm.castShadow = true;
    rightUpperArm.userData = { part: 'rightArm', name: 'Right Arm' };
    scene.add(rightUpperArm);
    bodyParts.rightArm = rightUpperArm;

    // Right Forearm
    const rightForearm = new THREE.Mesh(leftForearmGeometry, shoulderMaterial.clone());
    rightForearm.position.set(2.5, 2.2, 0);
    rightForearm.rotation.z = -Math.PI / 10;
    rightForearm.castShadow = true;
    scene.add(rightForearm);

    // === PELVIS ===
    const pelvisGeometry = new THREE.BoxGeometry(2.5, 1.5, 1.2);
    const pelvisMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd7b5,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.1,
        roughness: 0.7
    });
    const pelvis = new THREE.Mesh(pelvisGeometry, pelvisMaterial);
    pelvis.position.set(0, 0.8, 0);
    pelvis.castShadow = true;
    scene.add(pelvis);

    // === LEGS (More detailed) ===
    // Left Thigh
    const leftThighGeometry = new THREE.CylinderGeometry(0.5, 0.45, 2.5, 16);
    const legMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd7b5,
        emissive: healthColors.healthy,
        emissiveIntensity: 0.1,
        roughness: 0.7
    });
    const leftThigh = new THREE.Mesh(leftThighGeometry, legMaterial);
    leftThigh.position.set(-0.7, -1, 0);
    leftThigh.castShadow = true;
    scene.add(leftThigh);

    // Left Shin
    const leftShinGeometry = new THREE.CylinderGeometry(0.4, 0.35, 2.5, 16);
    const leftShin = new THREE.Mesh(leftShinGeometry, legMaterial.clone());
    leftShin.position.set(-0.7, -3.5, 0);
    leftShin.castShadow = true;
    leftShin.userData = { part: 'leftLeg', name: 'Left Leg' };
    scene.add(leftShin);
    bodyParts.leftLeg = leftShin;

    // Right Thigh
    const rightThigh = new THREE.Mesh(leftThighGeometry, legMaterial.clone());
    rightThigh.position.set(0.7, -1, 0);
    rightThigh.castShadow = true;
    scene.add(rightThigh);

    // Right Shin
    const rightShin = new THREE.Mesh(leftShinGeometry, legMaterial.clone());
    rightShin.position.set(0.7, -3.5, 0);
    rightShin.castShadow = true;
    rightShin.userData = { part: 'rightLeg', name: 'Right Leg' };
    scene.add(rightShin);
    bodyParts.rightLeg = rightShin;

    // Add subtle glow to all organs
    Object.values(bodyParts).forEach(part => {
        if (part.userData.part && part.userData.part !== 'head' && part.userData.part !== 'torso') {
            // Add glow effect
            const glowGeometry = part.geometry.clone();
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: healthColors.healthy,
                transparent: true,
                opacity: 0.1,
                side: THREE.BackSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.scale.multiplyScalar(1.1);
            part.add(glow);
        }
    });

    // Update lung colors based on smoking
    updateLungHealth();
}

// Rest of the functions remain the same...
// (Include all the other functions from the original file)
