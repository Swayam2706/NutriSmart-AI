const HabitTracker = require('../models/HabitTracker');
const asyncHandler = require('../utils/asyncHandler');

const DEFAULT_HABITS = [
  'Drink 2L of water',
  'Avoid junk food',
  'Eat 2 servings of fruits',
  'No late night snacking',
];

/** Returns today's date as YYYY-MM-DD string */
const getTodayDate = () => new Date().toISOString().split('T')[0];

// @desc    Get user's habits (creates defaults if first time)
// @route   GET /api/habits
// @access  Private
exports.getHabits = asyncHandler(async (req, res) => {
  let tracker = await HabitTracker.findOne({ userId: req.user.id });

  if (!tracker) {
    const habits = DEFAULT_HABITS.map((name) => ({ name, streak: 0, lastCompleted: null }));
    tracker = await HabitTracker.create({ userId: req.user.id, habits });
  }

  res.json(tracker);
});

// @desc    Mark a habit as completed for today
// @route   PUT /api/habits/complete/:habitId
// @access  Private
exports.completeHabit = asyncHandler(async (req, res) => {
  const tracker = await HabitTracker.findOne({ userId: req.user.id });
  if (!tracker) {
    return res.status(404).json({ message: 'Habit tracker not found' });
  }

  const habit = tracker.habits.id(req.params.habitId);
  if (!habit) {
    return res.status(404).json({ message: 'Habit not found' });
  }

  const today = getTodayDate();

  if (habit.lastCompleted === today) {
    return res.status(400).json({ message: 'Habit already completed today' });
  }

  // Streak logic: consecutive days = increment, gap > 1 day = reset to 1
  if (!habit.lastCompleted) {
    habit.streak = 1;
  } else {
    const diffDays = Math.round(
      (new Date(today) - new Date(habit.lastCompleted)) / (1000 * 60 * 60 * 24)
    );
    habit.streak = diffDays === 1 ? habit.streak + 1 : 1;
  }

  habit.lastCompleted = today;
  await tracker.save();

  res.json(tracker);
});
