import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  date: { type: String, required: true }, // YYYY-MM-DD format
  completedExercises: [{ type: String }],
  mealsConsumed: [{ type: String }],
  actualMeals: [{
    name: { type: String, required: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    time: { type: String }, // e.g. "14:30"
  }],
  waterIntake: { type: Number, default: 0 },
}, { timestamps: true });

// Compound index: one log per user per day
dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyLog', dailyLogSchema);
