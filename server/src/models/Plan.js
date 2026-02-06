import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: String },
  reps: { type: String },
  notes: { type: String },
}, { _id: false });

const workoutDaySchema = new mongoose.Schema({
  day: { type: String, required: true },
  focusArea: { type: String },
  exercises: [exerciseSchema],
}, { _id: false });

const mealOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number },
  protein: { type: Number },
  ingredients: [{ type: String }],
}, { _id: false });

const mealSchema = new mongoose.Schema({
  mealType: { type: String, required: true },
  options: [mealOptionSchema],
}, { _id: false });

const planSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  workoutPlan: [workoutDaySchema],
  dietPlan: [mealSchema],
  macroGoals: {
    protein: { type: Number },
    carbs: { type: Number },
    fats: { type: Number },
    dailyCalories: { type: Number },
  },
}, { timestamps: true });

export default mongoose.model('Plan', planSchema);
