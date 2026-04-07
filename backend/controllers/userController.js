const User = require('../models/User');
const { calculateBMI, calculateCalorieNeeds } = require('../utils/calculations');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get authenticated user's profile with computed health metrics
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const bmi = calculateBMI(user.weight, user.height);
  const dailyCaloriesGoal = calculateCalorieNeeds(user.weight, user.height, user.age, user.goal);

  // Return plain object — avoid leaking Mongoose internals via _doc spread
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    weight: user.weight,
    height: user.height,
    diet: user.diet,
    goal: user.goal,
    bmi,
    dailyCaloriesGoal,
  });
});
