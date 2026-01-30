/**
 * Diet & Nutrition - Real-Time Database Integration
 * Tracks meals, macros, and nutrition goals with Firebase
 */

let currentUser = null;
let todayMeals = [];
let currentMealTab = 'breakfast';
let nutritionGoals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 67,
    water: 8
};

// ================= AUTHENTICATION & DATA LOADING =================
async function checkAuthAndLoadData() {
    try {
        currentUser = await AuthService.checkAuth();

        if (!currentUser) {
            window.location.href = '../../../auth/login.html';
            return;
        }

        console.log('✅ User authenticated:', currentUser.uid);
        await loadTodayMeals();
        updateUI();
        initializeCharts();

    } catch (error) {
        console.error('❌ Error loading data:', error);
        window.location.href = '../../../auth/login.html';
    }
}

// ================= LOAD TODAY'S MEALS =================
async function loadTodayMeals() {
    try {
        const today = new Date().toISOString().split('T')[0];
        const result = await HealthDataService.getMeals(currentUser.uid, today);

        if (result.success) {
            todayMeals = result.data;
            console.log('✅ Meals loaded:', todayMeals.length, 'meals');
        } else {
            console.warn('⚠️ No meals found for today');
            todayMeals = [];
        }
    } catch (error) {
        console.error('❌ Error loading meals:', error);
        todayMeals = [];
    }
}

// ================= UPDATE UI =================
function updateUI() {
    updateNutritionSummary();
    updateMealList();
    updateMacroBreakdown();
}

// ================= UPDATE NUTRITION SUMMARY =================
function updateNutritionSummary() {
    const totals = calculateTotals();

    // Update calories
    document.getElementById('caloriesConsumed').textContent = totals.calories;
    updateProgress('caloriesProgress', totals.calories, nutritionGoals.calories);

    // Update protein
    document.getElementById('proteinConsumed').textContent = `${totals.protein}g`;
    updateProgress('proteinProgress', totals.protein, nutritionGoals.protein);

    // Update carbs
    document.getElementById('carbsConsumed').textContent = `${totals.carbs}g`;
    updateProgress('carbsProgress', totals.carbs, nutritionGoals.carbs);

    // Update fats
    document.getElementById('fatsConsumed').textContent = `${totals.fats}g`;
    updateProgress('fatsProgress', totals.fats, nutritionGoals.fats);

    // Update water
    document.getElementById('waterConsumed').textContent = totals.water || 0;
    updateProgress('waterProgress', totals.water || 0, nutritionGoals.water);
}

// ================= CALCULATE TOTALS =================
function calculateTotals() {
    return todayMeals.reduce((totals, meal) => {
        totals.calories += meal.calories || 0;
        totals.protein += meal.protein || 0;
        totals.carbs += meal.carbs || 0;
        totals.fats += meal.fats || 0;
        totals.water += meal.water || 0;
        return totals;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0, water: 0 });
}

// ================= UPDATE PROGRESS BAR =================
function updateProgress(elementId, current, goal) {
    const progressElement = document.getElementById(elementId);
    if (progressElement) {
        const percentage = Math.min((current / goal) * 100, 100);
        progressElement.style.width = `${percentage}%`;
    }
}

// ================= UPDATE MEAL LIST =================
function updateMealList() {
    const mealList = document.getElementById('mealList');
    const mealsForTab = todayMeals.filter(meal => meal.mealType === currentMealTab);

    if (mealsForTab.length === 0) {
        mealList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🍽️</div>
                <p>No ${currentMealTab} logged yet</p>
                <button class="btn-add-meal" onclick="openMealLog()">Add Your First Meal</button>
            </div>
        `;
        return;
    }

    mealList.innerHTML = mealsForTab.map(meal => `
        <div class="meal-item">
            <div class="meal-info">
                <h4>${meal.foodName}</h4>
                <p>${meal.calories} kcal • P: ${meal.protein}g • C: ${meal.carbs}g • F: ${meal.fats}g</p>
            </div>
            <button class="btn-delete" onclick="deleteMeal('${meal.id}')">🗑️</button>
        </div>
    `).join('');
}

// ================= UPDATE MACRO BREAKDOWN =================
function updateMacroBreakdown() {
    const totals = calculateTotals();
    const totalMacros = totals.protein + totals.carbs + totals.fats;

    if (totalMacros === 0) {
        document.getElementById('macroProtein').textContent = '0%';
        document.getElementById('macroCarbs').textContent = '0%';
        document.getElementById('macroFats').textContent = '0%';
        return;
    }

    const proteinPercent = Math.round((totals.protein / totalMacros) * 100);
    const carbsPercent = Math.round((totals.carbs / totalMacros) * 100);
    const fatsPercent = Math.round((totals.fats / totalMacros) * 100);

    document.getElementById('macroProtein').textContent = `${proteinPercent}%`;
    document.getElementById('macroCarbs').textContent = `${carbsPercent}%`;
    document.getElementById('macroFats').textContent = `${fatsPercent}%`;
}

// ================= SWITCH MEAL TAB =================
function switchMealTab(tab) {
    currentMealTab = tab;

    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update meal list
    updateMealList();
}

// ================= OPEN MEAL LOG MODAL =================
function openMealLog() {
    const modal = document.getElementById('mealModal');
    modal.style.display = 'flex';

    // Set meal type to current tab
    document.getElementById('mealType').value = currentMealTab;
}

// ================= CLOSE MEAL LOG MODAL =================
function closeMealLog() {
    const modal = document.getElementById('mealModal');
    modal.style.display = 'none';

    // Clear form
    document.getElementById('foodName').value = '';
    document.getElementById('foodCalories').value = '';
    document.getElementById('foodQuantity').value = '1';
    document.getElementById('foodProtein').value = '';
    document.getElementById('foodCarbs').value = '';
    document.getElementById('foodFats').value = '';
}

// ================= SAVE MEAL =================
async function saveMeal() {
    const mealData = {
        mealType: document.getElementById('mealType').value,
        foodName: document.getElementById('foodName').value,
        calories: parseFloat(document.getElementById('foodCalories').value) || 0,
        quantity: parseFloat(document.getElementById('foodQuantity').value) || 1,
        protein: parseFloat(document.getElementById('foodProtein').value) || 0,
        carbs: parseFloat(document.getElementById('foodCarbs').value) || 0,
        fats: parseFloat(document.getElementById('foodFats').value) || 0,
        date: new Date().toISOString().split('T')[0]
    };

    if (!mealData.foodName) {
        alert('Please enter a food name');
        return;
    }

    try {
        const result = await HealthDataService.saveMeal(currentUser.uid, mealData);

        if (result.success) {
            console.log('✅ Meal saved successfully');
            closeMealLog();
            await loadTodayMeals();
            updateUI();
        } else {
            console.error('❌ Failed to save meal');
            alert('Failed to save meal. Please try again.');
        }
    } catch (error) {
        console.error('❌ Error saving meal:', error);
        alert('An error occurred. Please try again.');
    }
}

// ================= DELETE MEAL =================
async function deleteMeal(mealId) {
    if (!confirm('Delete this meal?')) return;

    try {
        // Remove from local array
        todayMeals = todayMeals.filter(meal => meal.id !== mealId);

        // Delete from database
        await db.collection('meals').doc(currentUser.uid).collection('meals').doc(mealId).delete();

        console.log('✅ Meal deleted');
        updateUI();
    } catch (error) {
        console.error('❌ Error deleting meal:', error);
        alert('Failed to delete meal.');
    }
}

// ================= QUICK ADD WATER =================
async function quickAddWater() {
    const mealData = {
        mealType: 'snacks',
        foodName: 'Water',
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        water: 1,
        date: new Date().toISOString().split('T')[0]
    };

    try {
        await HealthDataService.saveMeal(currentUser.uid, mealData);
        await loadTodayMeals();
        updateUI();
    } catch (error) {
        console.error('❌ Error adding water:', error);
    }
}

// ================= QUICK ADD FOOD =================
async function quickAddFood(foodType) {
    const foodData = {
        apple: { name: 'Apple', calories: 95, protein: 0, carbs: 25, fats: 0 },
        banana: { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0 },
        chicken: { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fats: 4 },
        rice: { name: 'Rice (1 cup)', calories: 206, protein: 4, carbs: 45, fats: 0 }
    };

    const food = foodData[foodType];
    if (!food) return;

    const mealData = {
        mealType: currentMealTab,
        foodName: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fats: food.fats,
        date: new Date().toISOString().split('T')[0]
    };

    try {
        await HealthDataService.saveMeal(currentUser.uid, mealData);
        await loadTodayMeals();
        updateUI();
    } catch (error) {
        console.error('❌ Error adding food:', error);
    }
}

// ================= EDIT GOALS =================
function editGoals() {
    const calories = prompt('Daily calorie goal:', nutritionGoals.calories);
    const protein = prompt('Daily protein goal (g):', nutritionGoals.protein);
    const carbs = prompt('Daily carbs goal (g):', nutritionGoals.carbs);
    const fats = prompt('Daily fats goal (g):', nutritionGoals.fats);

    if (calories) nutritionGoals.calories = parseInt(calories);
    if (protein) nutritionGoals.protein = parseInt(protein);
    if (carbs) nutritionGoals.carbs = parseInt(carbs);
    if (fats) nutritionGoals.fats = parseInt(fats);

    updateUI();
}

// ================= INITIALIZE CHARTS =================
function initializeCharts() {
    // Macro Chart
    const macroCtx = document.getElementById('macroChart');
    if (macroCtx) {
        const totals = calculateTotals();

        new Chart(macroCtx, {
            type: 'doughnut',
            data: {
                labels: ['Protein', 'Carbs', 'Fats'],
                datasets: [{
                    data: [totals.protein, totals.carbs, totals.fats],
                    backgroundColor: ['#22d3ee', '#fbbf24', '#f87171'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // Nutrition Chart
    const nutritionCtx = document.getElementById('nutritionChart');
    if (nutritionCtx) {
        new Chart(nutritionCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Calories',
                    data: [1800, 2100, 1950, 2200, 1900, 2050, 2000],
                    borderColor: '#22d3ee',
                    backgroundColor: 'rgba(34, 211, 238, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#9ca3af' }
                    },
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { color: '#9ca3af' }
                    }
                }
            }
        });
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
    console.log('🔵 Diet & Nutrition page loading...');
    await checkAuthAndLoadData();
    console.log('✅ Diet & Nutrition page loaded');
});

// Make functions globally available
window.switchMealTab = switchMealTab;
window.openMealLog = openMealLog;
window.closeMealLog = closeMealLog;
window.saveMeal = saveMeal;
window.deleteMeal = deleteMeal;
window.quickAddWater = quickAddWater;
window.quickAddFood = quickAddFood;
window.editGoals = editGoals;
window.toggleSidebar = toggleSidebar;

console.log('💚 Diet & Nutrition Real-Time Integration loaded');
