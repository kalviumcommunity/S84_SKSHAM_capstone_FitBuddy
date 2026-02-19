import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  height: { type: Number },
  weight: { type: Number },
  country: { type: String, default: '' },
  goal: { type: String, enum: ['cut', 'bulk', 'maintain', 'strength'] },
  activityLevel: { type: String, enum: ['sedentary', 'light', 'moderate', 'active', 'athlete'] },
  workoutPreference: { type: String, enum: ['gym', 'home', 'calisthenics'] },
  dietaryPreference: { type: String, enum: ['veg', 'non-veg', 'vegan', 'keto'] },
  allergies: [{ type: String }],
  injuries: [{ type: String }],
  medicalConditions: [{ type: String }],  // New field for medical conditions/diseases
  customDescription: { type: String, default: '' },  // New field for custom workout description
  budget: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  targetBodyParts: [{ type: String }],
  equipmentAvailable: [{ type: String }],
  strengthParts: [{ type: String }],
  weaknessParts: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Profile', profileSchema);
