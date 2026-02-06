import mongoose from 'mongoose';

const dailyLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  date: { type: String, required: true }, // YYYY-MM-DD format
  completedExercises: [{ type: String }],
  mealsConsumed: [{ type: String }],
  waterIntake: { type: Number, default: 0 },
}, { timestamps: true });

// Compound index: one log per user per day
dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model('DailyLog', dailyLogSchema);
