// ================= MEAL ANALYZER PAGE JAVASCRIPT =================

// State management
let currentAnalysis = null;
let analysisHistory = [];
let dailyProtein = 0;
let proteinGoal = 120; // Default goal in grams
let mealsToday = 0;

// Food database with nutrition info (per 100g or typical serving)
const foodDatabase = {
    // Proteins
    'chicken': { protein: 31, calories: 165, carbs: 0, fats: 3.6, emoji: '🍗', category: 'protein' },
    'paneer': { protein: 18, calories: 265, carbs: 1.2, fats: 20, emoji: '🧀', category: 'protein' },
    'egg': { protein: 13, calories: 155, carbs: 1.1, fats: 11, emoji: '🥚', category: 'protein' },
    'dal': { protein: 9, calories: 116, carbs: 20, fats: 0.4, emoji: '🍲', category: 'protein' },
    'fish': { protein: 22, calories: 206, carbs: 0, fats: 12, emoji: '🐟', category: 'protein' },
    'tofu': { protein: 8, calories: 76, carbs: 1.9, fats: 4.8, emoji: '🥡', category: 'protein' },
    'mutton': { protein: 25, calories: 294, carbs: 0, fats: 21, emoji: '🍖', category: 'protein' },

    // Carbs
    'rice': { protein: 2.7, calories: 130, carbs: 28, fats: 0.3, emoji: '🍚', category: 'carb' },
    'roti': { protein: 3, calories: 71, carbs: 15, fats: 0.4, emoji: '🫓', category: 'carb' },
    'bread': { protein: 9, calories: 265, carbs: 49, fats: 3.2, emoji: '🍞', category: 'carb' },
    'pasta': { protein: 5, calories: 131, carbs: 25, fats: 1.1, emoji: '🍝', category: 'carb' },

    // Vegetables
    'salad': { protein: 1.2, calories: 15, carbs: 3, fats: 0.2, emoji: '🥗', category: 'vegetable' },
    'broccoli': { protein: 2.8, calories: 34, carbs: 7, fats: 0.4, emoji: '🥦', category: 'vegetable' },
    'spinach': { protein: 2.9, calories: 23, carbs: 3.6, fats: 0.4, emoji: '🥬', category: 'vegetable' },

    // Others
    'yogurt': { protein: 10, calories: 59, carbs: 3.6, fats: 0.4, emoji: '🥛', category: 'dairy' },
    'milk': { protein: 3.4, calories: 42, carbs: 5, fats: 1, emoji: '🥛', category: 'dairy' }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    loadData();
    setupDragAndDrop();
    updateProteinTracker();
    loadHistory();
});

// ================= DRAG AND DROP =================
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.add('drag-over');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, () => {
            uploadArea.classList.remove('drag-over');
        }, false);
    });

    uploadArea.addEventListener('drop', handleDrop, false);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        handleImageFile(files[0]);
    }
}

// ================= IMAGE UPLOAD =================
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        handleImageFile(file);
    }
}

function handleImageFile(file) {
    // Validate file
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
    }

    // Read and display image
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('mealImage').src = e.target.result;

        // Show analysis card
        document.getElementById('analysisCard').style.display = 'block';

        // Simulate AI analysis
        analyzeImage(e.target.result);
    };
    reader.readAsDataURL(file);
}

function openCamera() {
    // For mobile devices, this will open the camera
    const input = document.getElementById('mealImageInput');
    input.setAttribute('capture', 'environment');
    input.click();
}

// ================= AI ANALYSIS (SIMULATED) =================
function analyzeImage(imageData) {
    // Show loading state
    document.getElementById('proteinValue').textContent = 'Analyzing...';
    document.getElementById('caloriesValue').textContent = '--';
    document.getElementById('carbsValue').textContent = '--';
    document.getElementById('fatsValue').textContent = '--';
    document.getElementById('sourcesList').innerHTML = '<p style="color: var(--muted); font-size: 13px;">Detecting food items...</p>';
    document.getElementById('foodItemsGrid').innerHTML = '<p style="color: var(--muted); font-size: 13px;">Analyzing...</p>';

    // Simulate AI processing delay
    setTimeout(() => {
        // Simulated AI detection - in real app, this would call an AI API
        const detectedFoods = simulateAIDetection();
        displayAnalysisResults(detectedFoods);
    }, 2000);
}

function simulateAIDetection() {
    // Randomly select 3-5 food items for demo
    const foodKeys = Object.keys(foodDatabase);
    const numItems = Math.floor(Math.random() * 3) + 3; // 3-5 items
    const detected = [];

    for (let i = 0; i < numItems; i++) {
        const randomFood = foodKeys[Math.floor(Math.random() * foodKeys.length)];
        const portion = ['small', 'medium', 'large'][Math.floor(Math.random() * 3)];
        const multiplier = portion === 'small' ? 0.7 : portion === 'medium' ? 1 : 1.3;

        detected.push({
            name: randomFood,
            portion: portion,
            multiplier: multiplier,
            data: foodDatabase[randomFood]
        });
    }

    return detected;
}

function displayAnalysisResults(detectedFoods) {
    // Calculate total nutrition
    let totalProtein = 0;
    let totalCalories = 0;
    let totalCarbs = 0;
    let totalFats = 0;

    detectedFoods.forEach(food => {
        totalProtein += food.data.protein * food.multiplier;
        totalCalories += food.data.calories * food.multiplier;
        totalCarbs += food.data.carbs * food.multiplier;
        totalFats += food.data.fats * food.multiplier;
    });

    // Round values
    totalProtein = Math.round(totalProtein);
    totalCalories = Math.round(totalCalories);
    totalCarbs = Math.round(totalCarbs);
    totalFats = Math.round(totalFats);

    // Update UI
    document.getElementById('proteinValue').textContent = `${totalProtein}g`;
    document.getElementById('caloriesValue').textContent = `${totalCalories} kcal`;
    document.getElementById('carbsValue').textContent = `${totalCarbs}g`;
    document.getElementById('fatsValue').textContent = `${totalFats}g`;

    // Update protein status
    updateProteinStatus(totalProtein);

    // Display protein sources
    displayProteinSources(detectedFoods);

    // Display food items
    displayFoodItems(detectedFoods);

    // Generate insights
    generateInsights(totalProtein, detectedFoods);

    // Store current analysis
    currentAnalysis = {
        image: document.getElementById('mealImage').src,
        foods: detectedFoods,
        nutrition: {
            protein: totalProtein,
            calories: totalCalories,
            carbs: totalCarbs,
            fats: totalFats
        },
        timestamp: Date.now()
    };
}

function updateProteinStatus(protein) {
    const statusElement = document.getElementById('proteinStatus');
    let statusText, statusClass;

    if (protein >= 30) {
        statusText = 'High Protein';
        statusClass = 'high';
    } else if (protein >= 15) {
        statusText = 'Balanced';
        statusClass = 'balanced';
    } else {
        statusText = 'Low Protein';
        statusClass = 'low';
    }

    statusElement.innerHTML = `
        <span class="status-dot ${statusClass}"></span>
        <span class="status-text">${statusText}</span>
    `;
}

function displayProteinSources(foods) {
    const proteinFoods = foods.filter(f => f.data.category === 'protein');
    const sourcesList = document.getElementById('sourcesList');

    if (proteinFoods.length === 0) {
        sourcesList.innerHTML = '<p style="color: var(--muted); font-size: 13px;">No significant protein sources detected</p>';
        return;
    }

    sourcesList.innerHTML = proteinFoods.map(food =>
        `<span class="source-tag">${food.data.emoji} ${capitalizeFirst(food.name)}</span>`
    ).join('');
}

function displayFoodItems(foods) {
    const grid = document.getElementById('foodItemsGrid');

    grid.innerHTML = foods.map(food => `
        <div class="food-item">
            <span class="food-item-icon">${food.data.emoji}</span>
            <div class="food-item-details">
                <span class="food-item-name">${capitalizeFirst(food.name)}</span>
                <span class="food-item-portion">${capitalizeFirst(food.portion)} portion</span>
            </div>
        </div>
    `).join('');
}

function generateInsights(protein, foods) {
    // Protein insight
    let proteinInsight;
    if (protein >= 30) {
        proteinInsight = 'Excellent protein content! This meal provides substantial protein for muscle maintenance and growth.';
    } else if (protein >= 15) {
        proteinInsight = 'Good protein intake. This meal provides a balanced amount of protein.';
    } else {
        proteinInsight = 'Low protein content. Consider adding a protein source like chicken, paneer, eggs, or dal.';
    }

    document.getElementById('proteinInsightText').textContent = proteinInsight;

    // Suggestion
    const hasProtein = foods.some(f => f.data.category === 'protein');
    const hasCarb = foods.some(f => f.data.category === 'carb');
    const hasVeg = foods.some(f => f.data.category === 'vegetable');

    let suggestion;
    if (!hasProtein) {
        suggestion = 'Add a protein source like chicken, fish, eggs, or dal to make this meal more balanced.';
    } else if (!hasVeg) {
        suggestion = 'Add some vegetables or salad for fiber and micronutrients.';
    } else if (protein < 20) {
        suggestion = 'Consider increasing the protein portion or adding another protein source for your next meal.';
    } else {
        suggestion = 'Well-balanced meal! Keep up the good nutrition habits.';
    }

    document.getElementById('suggestionText').textContent = suggestion;
}

// ================= SAVE ANALYSIS =================
function saveAnalysis() {
    if (!currentAnalysis) return;

    // Add to history
    analysisHistory.unshift({
        ...currentAnalysis,
        date: new Date().toISOString()
    });

    // Update daily protein
    dailyProtein += currentAnalysis.nutrition.protein;
    mealsToday++;

    // Save to localStorage
    localStorage.setItem('mealAnalysisHistory', JSON.stringify(analysisHistory));
    localStorage.setItem('dailyProtein', dailyProtein.toString());
    localStorage.setItem('mealsToday', mealsToday.toString());

    // Update UI
    updateProteinTracker();
    loadHistory();

    // Show success message
    showSuccessMessage('Analysis saved to history!');
}

function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.innerHTML = `
        <span style="font-size: 24px;">✓</span>
        <span>${message}</span>
    `;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ================= PROTEIN TRACKER =================
function updateProteinTracker() {
    document.getElementById('dailyProteinValue').textContent = `${dailyProtein}g`;
    document.getElementById('proteinGoal').textContent = `${proteinGoal}g`;
    document.getElementById('mealsLogged').textContent = mealsToday;
    document.getElementById('proteinRemaining').textContent = `${Math.max(0, proteinGoal - dailyProtein)}g`;

    const progress = Math.min(100, Math.round((dailyProtein / proteinGoal) * 100));
    document.getElementById('proteinProgress').textContent = `${progress}%`;

    // Update circle
    const circle = document.getElementById('proteinProgressCircle');
    if (circle) {
        const circumference = 2 * Math.PI * 85;
        const offset = circumference - (progress / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }
}

function setProteinGoal() {
    const newGoal = prompt('Enter your daily protein goal (grams):', proteinGoal);
    if (newGoal && !isNaN(newGoal) && newGoal > 0) {
        proteinGoal = parseInt(newGoal);
        localStorage.setItem('proteinGoal', proteinGoal.toString());
        updateProteinTracker();
    }
}

// ================= HISTORY =================
function loadHistory() {
    const historyList = document.getElementById('historyList');

    if (analysisHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <span class="empty-icon">📭</span>
                <p>No analyses yet. Upload your first meal!</p>
            </div>
        `;
        return;
    }

    historyList.innerHTML = analysisHistory.slice(0, 5).map((analysis, index) => {
        const date = new Date(analysis.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const foodNames = analysis.foods.map(f => capitalizeFirst(f.name)).join(', ');

        return `
            <div class="history-item" onclick="viewHistoryItem(${index})">
                <img src="${analysis.image}" alt="Meal" class="history-thumbnail">
                <div class="history-details">
                    <div class="history-date">${date}</div>
                    <div class="history-protein">${analysis.nutrition.protein}g protein</div>
                    <div class="history-foods">${foodNames}</div>
                </div>
            </div>
        `;
    }).join('');
}

function viewHistoryItem(index) {
    const analysis = analysisHistory[index];
    if (!analysis) return;

    // Load the analysis
    document.getElementById('mealImage').src = analysis.image;
    document.getElementById('analysisCard').style.display = 'block';

    // Display results
    displayAnalysisResults(analysis.foods);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function viewAnalysisHistory() {
    if (analysisHistory.length === 0) {
        alert('No analysis history yet. Upload your first meal!');
        return;
    }

    alert(`You have ${analysisHistory.length} meal analyses in your history. Scroll down to see recent analyses.`);
}

// ================= CLEAR & RESET =================
function clearAnalysis() {
    document.getElementById('analysisCard').style.display = 'none';
    document.getElementById('mealImageInput').value = '';
    currentAnalysis = null;
}

function analyzeAnother() {
    clearAnalysis();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================= DATA PERSISTENCE =================
function loadData() {
    // Load history
    const savedHistory = localStorage.getItem('mealAnalysisHistory');
    if (savedHistory) {
        analysisHistory = JSON.parse(savedHistory);
    }

    // Load daily protein (reset if new day)
    const lastDate = localStorage.getItem('lastProteinDate');
    const today = new Date().toDateString();

    if (lastDate !== today) {
        // New day, reset
        dailyProtein = 0;
        mealsToday = 0;
        localStorage.setItem('lastProteinDate', today);
        localStorage.setItem('dailyProtein', '0');
        localStorage.setItem('mealsToday', '0');
    } else {
        dailyProtein = parseInt(localStorage.getItem('dailyProtein') || '0');
        mealsToday = parseInt(localStorage.getItem('mealsToday') || '0');
    }

    // Load protein goal
    const savedGoal = localStorage.getItem('proteinGoal');
    if (savedGoal) {
        proteinGoal = parseInt(savedGoal);
    }
}

// ================= UTILITIES =================
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .status-dot.high {
        background: var(--success);
    }
    
    .status-dot.balanced {
        background: var(--accent-secondary);
    }
    
    .status-dot.low {
        background: var(--warning);
    }
`;
document.head.appendChild(style);

// Add SVG gradient for progress circle
const svg = document.querySelector('.progress-svg');
if (svg) {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'proteinGradient');
    gradient.innerHTML = `
        <stop offset="0%" stop-color="#22c55e" />
        <stop offset="100%" stop-color="#38bdf8" />
    `;
    defs.appendChild(gradient);
    svg.appendChild(defs);
}
