const { body, param, query } = require('express-validator');

// ─── Auth Validators ──────────────────────────────────────────────────────────
const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2–50 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
  body('weight')
    .notEmpty().withMessage('Weight is required')
    .isFloat({ min: 1, max: 500 }).withMessage('Weight must be between 1 and 500 kg'),
  body('height')
    .notEmpty().withMessage('Height is required')
    .isFloat({ min: 50, max: 300 }).withMessage('Height must be between 50 and 300 cm'),
  body('diet')
    .notEmpty().withMessage('Diet preference is required')
    .isIn(['veg', 'non-veg']).withMessage('Diet must be veg or non-veg'),
  body('goal')
    .notEmpty().withMessage('Goal is required')
    .isIn(['lose', 'gain', 'maintain']).withMessage('Goal must be lose, gain, or maintain'),
];

const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ─── Tracker Validators ───────────────────────────────────────────────────────
const addMealValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Food name is required')
    .isLength({ max: 100 }).withMessage('Food name too long')
    .escape(),
  body('calories')
    .notEmpty().withMessage('Calories are required')
    .isFloat({ min: 0, max: 10000 }).withMessage('Calories must be between 0 and 10000'),
  body('timeOfDay')
    .notEmpty().withMessage('Time of day is required')
    .isIn(['breakfast', 'lunch', 'snack', 'dinner']).withMessage('Invalid time of day'),
];

const mealIdValidator = [
  param('mealId')
    .isMongoId().withMessage('Invalid meal ID'),
];

// ─── Habit Validators ─────────────────────────────────────────────────────────
const habitIdValidator = [
  param('habitId')
    .isMongoId().withMessage('Invalid habit ID'),
];

// ─── Food Validators ──────────────────────────────────────────────────────────
const recommendationsValidator = [
  query('timeOfDay')
    .optional()
    .isIn(['breakfast', 'lunch', 'snack', 'dinner']).withMessage('Invalid time of day'),
];

module.exports = {
  registerValidator,
  loginValidator,
  addMealValidator,
  mealIdValidator,
  habitIdValidator,
  recommendationsValidator,
};
