// ================= CALORIE CALCULATOR - ENHANCED FEATURES =================

let tdeeValue = 0;
let currentWeight = 0;
let currentHeight = 0;

// ================= TDEE CALCULATOR =================
function calculateTDEE() {
    const age = +document.getElementById("age").value;
    const height = +document.getElementById("height").value;
    const weight = +document.getElementById("weight").value;
    const gender = document.getElementById("gender").value;
    const activity = +document.getElementById("activity").value;

    if (!age || !height || !weight) {
        showNotification("Please fill all required fields", "error");
        return;
    }

    if (age < 1 || age > 120) {
        showNotification("Please enter a valid age (1-120)", "error");
        return;
    }

    if (height < 50 || height > 250) {
        showNotification("Please enter a valid height (50-250 cm)", "error");
        return;
    }

    if (weight < 20 || weight > 300) {
        showNotification("Please enter a valid weight (20-300 kg)", "error");
        return;
    }

    // Store for other calculations
    currentWeight = weight;
    currentHeight = height;

    // Mifflin-St Jeor BMR Formula
    let bmr = gender === "male"
        ? (10 * weight) + (6.25 * height) - (5 * age) + 5
        : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    tdeeValue = Math.round(bmr * activity);

    // Update TDEE display
    document.getElementById("maintenance").innerText = tdeeValue.toLocaleString();

    // Update weight loss goals
    document.getElementById("mildLoss").innerText = (tdeeValue - 250).toLocaleString() + " kcal";
    document.getElementById("loss").innerText = (tdeeValue - 500).toLocaleString() + " kcal";
    document.getElementById("extremeLoss").innerText = (tdeeValue - 1000).toLocaleString() + " kcal";

    // Update weight gain goals
    document.getElementById("mildGain").innerText = (tdeeValue + 250).toLocaleString() + " kcal";
    document.getElementById("gain").innerText = (tdeeValue + 500).toLocaleString() + " kcal";
    document.getElementById("fastGain").innerText = (tdeeValue + 1000).toLocaleString() + " kcal";

    // Auto-fill target calories for macro calculator
    document.getElementById("targetCalories").value = tdeeValue;

    // Auto-calculate BMI
    calculateBMI();

    // Generate meal suggestions
    generateMealSuggestions(tdeeValue);

    // Sync with dashboard
    localStorage.setItem("dailyCalories", tdeeValue);
    localStorage.setItem("userWeight", weight);
    localStorage.setItem("userHeight", height);

    showNotification("TDEE calculated successfully!", "success");
}

// ================= BMI CALCULATOR =================
function calculateBMI() {
    const weight = +document.getElementById("weight").value || currentWeight;
    const height = +document.getElementById("height").value || currentHeight;

    if (!weight || !height) {
        document.getElementById("bmiValue").innerText = "--";
        document.getElementById("bmiCategory").innerText = "Enter your details";
        return;
    }

    // BMI = weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const bmiRounded = bmi.toFixed(1);

    document.getElementById("bmiValue").innerText = bmiRounded;

    // Determine BMI category
    let category = "";
    let categoryClass = "";
    let indicatorPosition = 0;

    if (bmi < 18.5) {
        category = "Underweight";
        categoryClass = "bmi-underweight";
        indicatorPosition = (bmi / 18.5) * 25; // 0-25% of bar
    } else if (bmi < 25) {
        category = "Normal Weight";
        categoryClass = "bmi-normal";
        indicatorPosition = 25 + ((bmi - 18.5) / 6.5) * 25; // 25-50% of bar
    } else if (bmi < 30) {
        category = "Overweight";
        categoryClass = "bmi-overweight";
        indicatorPosition = 50 + ((bmi - 25) / 5) * 25; // 50-75% of bar
    } else {
        category = "Obese";
        categoryClass = "bmi-obese";
        indicatorPosition = 75 + Math.min(((bmi - 30) / 20) * 25, 25); // 75-100% of bar
    }

    document.getElementById("bmiCategory").innerText = category;
    document.getElementById("bmiCategory").className = categoryClass;

    // Update indicator position
    const indicator = document.getElementById("bmiIndicator");
    indicator.style.width = Math.min(indicatorPosition, 100) + "%";
    indicator.className = "bmi-indicator " + categoryClass;
}

// ================= MACRO CALCULATOR =================
function calculateMacros() {
    const targetCalories = +document.getElementById("targetCalories").value;
    const macroSplit = document.getElementById("macroSplit").value;

    if (!targetCalories || targetCalories < 0) {
        showNotification("Please enter target calories", "error");
        return;
    }

    // Macro splits (protein/carbs/fats percentages)
    const splits = {
        "balanced": { protein: 30, carbs: 40, fats: 30 },
        "high-protein": { protein: 40, carbs: 40, fats: 20 },
        "low-carb": { protein: 25, carbs: 25, fats: 50 },
        "high-carb": { protein: 20, carbs: 50, fats: 30 }
    };

    const split = splits[macroSplit];

    // Calculate grams (1g protein/carbs = 4 kcal, 1g fat = 9 kcal)
    const proteinCalories = (targetCalories * split.protein) / 100;
    const carbsCalories = (targetCalories * split.carbs) / 100;
    const fatsCalories = (targetCalories * split.fats) / 100;

    const proteinGrams = Math.round(proteinCalories / 4);
    const carbsGrams = Math.round(carbsCalories / 4);
    const fatsGrams = Math.round(fatsCalories / 9);

    // Update display
    document.getElementById("proteinGrams").innerText = proteinGrams + " g";
    document.getElementById("carbsGrams").innerText = carbsGrams + " g";
    document.getElementById("fatsGrams").innerText = fatsGrams + " g";

    // Update percentages
    document.querySelectorAll(".macro-percent").forEach((el, index) => {
        const values = [split.protein, split.carbs, split.fats];
        el.innerText = values[index] + "%";
    });

    // Animate bars
    const proteinBar = document.querySelector(".macro-fill.protein");
    const carbsBar = document.querySelector(".macro-fill.carbs");
    const fatsBar = document.querySelector(".macro-fill.fats");

    setTimeout(() => {
        proteinBar.style.width = split.protein + "%";
        carbsBar.style.width = split.carbs + "%";
        fatsBar.style.width = split.fats + "%";
    }, 100);

    // Store in localStorage
    localStorage.setItem("macroTargets", JSON.stringify({
        protein: proteinGrams,
        carbs: carbsGrams,
        fats: fatsGrams
    }));
}

// ================= CALORIES BURN CALCULATOR =================
function calculateBurn() {
    const walk = +document.getElementById("walk").value || 0;
    const run = +document.getElementById("run").value || 0;
    const gym = +document.getElementById("gym").value || 0;
    const cycle = +document.getElementById("cycle").value || 0;
    const swim = +document.getElementById("swim").value || 0;

    // Calories burned per minute (approximate for 70kg person)
    // These values adjust based on intensity
    const burnRates = {
        walk: 4,      // Moderate walking
        run: 10,      // Running (8 km/h)
        gym: 8,       // Weight training
        cycle: 7,     // Cycling (moderate)
        swim: 11      // Swimming (moderate)
    };

    const totalBurn = Math.round(
        (walk * burnRates.walk) +
        (run * burnRates.run) +
        (gym * burnRates.gym) +
        (cycle * burnRates.cycle) +
        (swim * burnRates.swim)
    );

    document.getElementById("burn").innerText = totalBurn.toLocaleString();

    // Store in localStorage
    localStorage.setItem("caloriesBurned", totalBurn);
}

// ================= MEAL SUGGESTIONS =================
function generateMealSuggestions(targetCalories) {
    const suggestionsContainer = document.getElementById("mealSuggestions");

    if (!targetCalories || targetCalories < 1000) {
        suggestionsContainer.innerHTML = '<p class="meal-hint">Calculate your TDEE to get personalized meal suggestions</p>';
        return;
    }

    // Meal suggestions based on calorie target
    const meals = [
        {
            name: "Breakfast: Protein Oatmeal",
            calories: Math.round(targetCalories * 0.25),
            protein: Math.round(targetCalories * 0.25 * 0.3 / 4),
            carbs: Math.round(targetCalories * 0.25 * 0.4 / 4),
            fats: Math.round(targetCalories * 0.25 * 0.3 / 9)
        },
        {
            name: "Lunch: Grilled Chicken Salad",
            calories: Math.round(targetCalories * 0.35),
            protein: Math.round(targetCalories * 0.35 * 0.35 / 4),
            carbs: Math.round(targetCalories * 0.35 * 0.35 / 4),
            fats: Math.round(targetCalories * 0.35 * 0.30 / 9)
        },
        {
            name: "Dinner: Salmon with Vegetables",
            calories: Math.round(targetCalories * 0.30),
            protein: Math.round(targetCalories * 0.30 * 0.35 / 4),
            carbs: Math.round(targetCalories * 0.30 * 0.35 / 4),
            fats: Math.round(targetCalories * 0.30 * 0.30 / 9)
        },
        {
            name: "Snack: Greek Yogurt with Berries",
            calories: Math.round(targetCalories * 0.10),
            protein: Math.round(targetCalories * 0.10 * 0.40 / 4),
            carbs: Math.round(targetCalories * 0.10 * 0.40 / 4),
            fats: Math.round(targetCalories * 0.10 * 0.20 / 9)
        }
    ];

    let html = "";
    meals.forEach(meal => {
        html += `
            <div class="meal-item">
                <div class="meal-item-header">
                    <span class="meal-name">${meal.name}</span>
                    <span class="meal-calories">${meal.calories} kcal</span>
                </div>
                <div class="meal-macros">
                    <span>P: ${meal.protein}g</span>
                    <span>C: ${meal.carbs}g</span>
                    <span>F: ${meal.fats}g</span>
                </div>
            </div>
        `;
    });

    suggestionsContainer.innerHTML = html;
}

// ================= NOTIFICATION SYSTEM =================
function showNotification(message, type = "info") {
    // Remove existing notification
    const existing = document.querySelector(".notification");
    if (existing) existing.remove();

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add("show");
    }, 10);

    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ================= AUTO-CALCULATE ON INPUT CHANGE =================
document.addEventListener("DOMContentLoaded", () => {
    // Auto-calculate BMI when weight or height changes
    const weightInput = document.getElementById("weight");
    const heightInput = document.getElementById("height");

    if (weightInput) {
        weightInput.addEventListener("input", () => {
            if (weightInput.value && heightInput.value) {
                calculateBMI();
            }
        });
    }

    if (heightInput) {
        heightInput.addEventListener("input", () => {
            if (weightInput.value && heightInput.value) {
                calculateBMI();
            }
        });
    }

    // Auto-calculate macros when target calories change
    const targetCaloriesInput = document.getElementById("targetCalories");
    if (targetCaloriesInput) {
        targetCaloriesInput.addEventListener("input", () => {
            if (targetCaloriesInput.value) {
                calculateMacros();
            }
        });
    }

    // Auto-calculate burn when activity inputs change
    const activityInputs = ["walk", "run", "gym", "cycle", "swim"];
    activityInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener("input", calculateBurn);
        }
    });

    // Load saved data
    const savedCalories = localStorage.getItem("dailyCalories");
    if (savedCalories) {
        document.getElementById("targetCalories").value = savedCalories;
    }
});

// ================= SIDEBAR TOGGLE =================
function toggleSidebar() {
    document.body.classList.toggle("sidebar-collapsed");
}
