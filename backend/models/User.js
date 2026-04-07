const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, maxlength: 50 },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // excluded from queries by default
    age:      { type: Number, required: true, min: 1, max: 120 },
    weight:   { type: Number, required: true, min: 1 },  // kg
    height:   { type: Number, required: true, min: 50 }, // cm
    diet:     { type: String, required: true, enum: ['veg', 'non-veg'] },
    goal:     { type: String, required: true, enum: ['lose', 'gain', 'maintain'] },
  },
  { timestamps: true }
);

// Index for fast email lookups during login
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
