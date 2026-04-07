const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true }, // per serving
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  diet: { type: String, required: true, enum: ['veg', 'non-veg'] }, // veg or non-veg
  timeOfDay: { type: [String], required: true }, // ['breakfast', 'lunch', 'dinner']
  goalType: { type: [String], required: true } // ['lose', 'gain', 'maintain']
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
