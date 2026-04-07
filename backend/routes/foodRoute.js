const express = require('express');
const router = express.Router();
const { getRecommendations, seedFoods, getAllFoods } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');
const { recommendationsValidator } = require('../middleware/validators');
const validate = require('../middleware/validate');

router.get('/recommendations', protect, recommendationsValidator, validate, getRecommendations);
router.get('/',                protect, getAllFoods);
// Seed is admin-only in production; guard with env check
router.post('/seed', (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-seed-key'] !== process.env.SEED_KEY) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
}, seedFoods);

module.exports = router;
