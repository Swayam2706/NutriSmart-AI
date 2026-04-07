const DailyTracker = require('../models/DailyTracker');
const User = require('../models/User');
const { calculateCalorieNeeds } = require('../utils/calculations');
const asyncHandler = require('../utils/asyncHandler');

/** Returns today's date as YYYY-MM-DD string */
const getTodayDate = () => new Date().toISOString().split('T')[0];

/**
 * Builds the enriched tracker response with dailyGoal and remainingCalories.
 * Centralises the repeated pattern across all tracker endpoints.
 */
const buildTrackerResponse = async (tracker, userId) => {
  const user = await User.findById(userId).select('weight height age goal').lean();
  const dailyGoal = calculateCalorieNeeds(user.weight, user.height, user.age, user.goal);
  return {
    _id: tracker._id,
    userId: tracker.userId,
    date: tracker.date,
    meals: tracker.meals,
    totalCaloriesCons: tracker.totalCaloriesCons,
    dailyGoal,
    remainingCalories: dailyGoal - tracker.totalCaloriesCons,
  };
};

// @desc    Get today's tracking data (creates if not exists)
// @route   GET /api/tracker/today
// @access  Private
exports.getTodayTracking = asyncHandler(async (req, res) => {
  const date = getTodayDate();

  let tracker = await DailyTracker.findOne({ userId: req.user.id, date });
  if (!tracker) {
    tracker = await DailyTracker.create({ userId: req.user.id, date, meals: [], totalCaloriesCons: 0 });
  }

  res.json(await buildTrackerResponse(tracker, req.user.id));
});

// @desc    Add a meal to today's tracker
// @route   POST /api/tracker/add
// @access  Private
exports.addMeal = asyncHandler(async (req, res) => {
  const { name, calories, timeOfDay } = req.body;
  const date = getTodayDate();

  let tracker = await DailyTracker.findOne({ userId: req.user.id, date });
  if (!tracker) {
    tracker = await DailyTracker.create({ userId: req.user.id, date, meals: [], totalCaloriesCons: 0 });
  }

  tracker.meals.push({ name, calories: Number(calories), timeOfDay });
  tracker.totalCaloriesCons += Number(calories);
  await tracker.save();

  res.status(201).json(await buildTrackerResponse(tracker, req.user.id));
});

// @desc    Delete a meal from today's tracker
// @route   DELETE /api/tracker/meal/:mealId
// @access  Private
exports.deleteMeal = asyncHandler(async (req, res) => {
  const date = getTodayDate();
  const tracker = await DailyTracker.findOne({ userId: req.user.id, date });

  if (!tracker) {
    return res.status(404).json({ message: 'Tracker not found for today' });
  }

  const meal = tracker.meals.id(req.params.mealId);
  if (!meal) {
    return res.status(404).json({ message: 'Meal not found' });
  }

  tracker.totalCaloriesCons = Math.max(0, tracker.totalCaloriesCons - meal.calories);
  meal.deleteOne();
  await tracker.save();

  res.json(await buildTrackerResponse(tracker, req.user.id));
});
