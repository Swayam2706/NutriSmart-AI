const Food = require('../models/Food');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get food recommendations based on user's diet & goal
// @route   GET /api/foods/recommendations?timeOfDay=lunch
// @access  Private
exports.getRecommendations = asyncHandler(async (req, res) => {
  const { timeOfDay } = req.query;

  const user = await User.findById(req.user.id).select('diet goal');
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Both timeOfDay and goalType are stored as arrays in the Food schema — use $in
  const criteria = {
    diet: user.diet,
    goalType: { $in: [user.goal] },
  };

  if (timeOfDay) {
    criteria.timeOfDay = { $in: [timeOfDay] };
  }

  const foods = await Food.find(criteria).lean();

  // Shuffle and return up to 6 recommendations
  const shuffled = foods.sort(() => 0.5 - Math.random()).slice(0, 6);

  res.json(shuffled);
});

// @desc    Seed food database from local JSON dataset
// @route   POST /api/foods/seed
// @access  Protected by route-level env guard
exports.seedFoods = asyncHandler(async (req, res) => {
  const foodData = require('../data/foodDataset.json');
  await Food.deleteMany({});
  const created = await Food.insertMany(foodData);
  res.status(201).json({ message: `Seeded ${created.length} foods successfully` });
});

// @desc    Get all foods (for manual meal search)
// @route   GET /api/foods
// @access  Private
exports.getAllFoods = asyncHandler(async (req, res) => {
  // Use lean() for read-only queries — faster, returns plain JS objects
  const foods = await Food.find({}).lean();
  res.json(foods);
});
