const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  streak:        { type: Number, default: 0, min: 0 },
  lastCompleted: { type: String, default: null }, // YYYY-MM-DD or null
});

const habitTrackerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    habits: [habitSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('HabitTracker', habitTrackerSchema);
