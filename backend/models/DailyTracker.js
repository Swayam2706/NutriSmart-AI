const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  calories:  { type: Number, required: true, min: 0 },
  timeOfDay: { type: String, required: true, enum: ['breakfast', 'lunch', 'snack', 'dinner'] },
});

const dailyTrackerSchema = new mongoose.Schema(
  {
    userId:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date:              { type: String, required: true }, // YYYY-MM-DD
    meals:             [mealSchema],
    totalCaloriesCons: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

// Compound index: fast lookup by user + date (the most common query pattern)
dailyTrackerSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyTracker', dailyTrackerSchema);
