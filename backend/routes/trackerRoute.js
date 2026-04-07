const express = require('express');
const router = express.Router();
const { getTodayTracking, addMeal, deleteMeal } = require('../controllers/trackerController');
const { protect } = require('../middleware/authMiddleware');
const { addMealValidator, mealIdValidator } = require('../middleware/validators');
const validate = require('../middleware/validate');

router.get('/today',              protect, getTodayTracking);
router.post('/add',               protect, addMealValidator, validate, addMeal);
router.delete('/meal/:mealId',    protect, mealIdValidator,  validate, deleteMeal);

module.exports = router;
