const express = require('express');
const router = express.Router();
const { getHabits, completeHabit } = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');
const { habitIdValidator } = require('../middleware/validators');
const validate = require('../middleware/validate');

router.get('/',                        protect, getHabits);
router.put('/complete/:habitId',       protect, habitIdValidator, validate, completeHabit);

module.exports = router;
