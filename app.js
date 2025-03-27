class NutritionalAdvisor {
    constructor() {
        // Nutritional goals
        this.nutritionalGoals = {
            calories: 2000,
            protein: 50,
            carbs: 250,
            fat: 70
        };

        // Meals storage
        this.dailyMeals = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
        };

        // Initialize DOM elements
        this.mealTypeSelect = document.getElementById('meal-type');
        this.foodItemInput = document.getElementById('food-item');
        this.addMealButton = document.getElementById('add-meal-btn');
        this.mealsListContainer = document.getElementById('meals-list-container');
        this.nutritionSummaryContainer = document.getElementById('nutrition-summary-container');

        // Bind event listeners
        this.addMealButton.addEventListener('click', () => this.addMeal());

        // Load any existing meals from local storage
        this.loadMealsFromStorage();
    }

    // Generate mock nutrition data based on food item
    generateNutritionData(foodItem) {
        // Create a simple deterministic mock based on food item name
        const hash = foodItem.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        
        return {
            calories: Math.floor((hash % 300) + 50),   // 50-350 calories
            protein: Math.floor((hash % 20) + 5),      // 5-25g protein
            carbs: Math.floor((hash % 30) + 10),       // 10-40g carbs
            fat: Math.floor((hash % 15) + 3)           // 3-18g fat
        };
    }

    // Add a new meal
    addMeal() {
        const mealType = this.mealTypeSelect.value;
        const foodItem = this.foodItemInput.value.trim();

        if (!foodItem) {
            alert('Please enter a food item');
            return;
        }

        // Generate nutrition data
        const nutritionData = this.generateNutritionData(foodItem);

        // Add meal to daily meals
        this.dailyMeals[mealType].push({
            item: foodItem,
            nutrition: nutritionData
        });

        // Update UI
        this.updateMealsList();
        this.updateNutritionSummary();

        // Save to local storage
        this.saveMealsToStorage();

        // Clear input
        this.foodItemInput.value = '';
    }

    // Update the list of meals
    updateMealsList() {
        this.mealsListContainer.innerHTML = '';

        Object.entries(this.dailyMeals).forEach(([type, meals]) => {
            meals.forEach(meal => {
                const listItem = document.createElement('li');
                listItem.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)}: ${meal.item}`;
                this.mealsListContainer.appendChild(listItem);
            });
        });
    }

    // Calculate and update nutrition summary
    updateNutritionSummary() {
        const totalNutrition = {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0
        };

        // Sum nutrition from all meals
        Object.values(this.dailyMeals).forEach(meals => {
            meals.forEach(meal => {
                Object.keys(totalNutrition).forEach(nutrient => {
                    totalNutrition[nutrient] += meal.nutrition[nutrient];
                });
            });
        });

        // Clear previous summary
        this.nutritionSummaryContainer.innerHTML = '';

        // Create nutrition summary elements
        Object.entries(totalNutrition).forEach(([nutrient, amount]) => {
            const goal = this.nutritionalGoals[nutrient];
            const nutritionItem = document.createElement('div');
            nutritionItem.classList.add('nutrition-item');
            
            const difference = goal - amount;
            let recommendation = '';

            if (difference > 0) {
                recommendation = `Need ${difference.toFixed(2)} more ${nutrient} to meet goal`;
            } else if (difference < 0) {
                recommendation = `Exceeded goal by ${Math.abs(difference).toFixed(2)}`;
            } else {
                recommendation = 'Goal met';
            }

            nutritionItem.innerHTML = `
                <strong>${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}:</strong> 
                ${amount.toFixed(2)} 
                <small>(${recommendation})</small>
            `;

            this.nutritionSummaryContainer.appendChild(nutritionItem);
        });
    }

    // Save meals to local storage
    saveMealsToStorage() {
        localStorage.setItem('dailyMeals', JSON.stringify(this.dailyMeals));
    }

    // Load meals from local storage
    loadMealsFromStorage() {
        const savedMeals = localStorage.getItem('dailyMeals');
        if (savedMeals) {
            this.dailyMeals = JSON.parse(savedMeals);
            this.updateMealsList();
            this.updateNutritionSummary();
        }
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new NutritionalAdvisor();
});
