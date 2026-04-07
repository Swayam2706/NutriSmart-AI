// BMI Calculation
const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  return (weightKg / (heightM * heightM)).toFixed(2);
};

// Calorie Needs Calculation (Basic BMR - Mifflin-St Jeor Equation)
// Men: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5
// Women: 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) - 161
// Since we don't have gender, we'll use an average formula or just calculate based on a simplified formula
const calculateCalorieNeeds = (weightKg, heightCm, age, goal) => {
  // Rough baseline average BMR
  let bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age); 
  
  // Adjusted for lightly active
  let dailyNeeds = bmr * 1.375;

  if (goal === 'lose') {
    dailyNeeds -= 500;
  } else if (goal === 'gain') {
    dailyNeeds += 500;
  }

  // Minimum safe limit
  if (dailyNeeds < 1200) dailyNeeds = 1200;

  return Math.round(dailyNeeds);
};

module.exports = {
  calculateBMI,
  calculateCalorieNeeds
};
