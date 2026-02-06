import { Router } from 'express';
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = Router();

// GET /api/profile
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    res.json({ profile: profile || null });
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/profile
router.put('/', auth, async (req, res) => {
  try {
    const {
      age, gender, height, weight, goal, activityLevel,
      workoutPreference, dietaryPreference, allergies, injuries,
      budget, targetBodyParts, equipmentAvailable,
    } = req.body;

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      Object.assign(profile, {
        age, gender, height, weight, goal, activityLevel,
        workoutPreference, dietaryPreference, allergies, injuries,
        budget, targetBodyParts, equipmentAvailable,
      });
      await profile.save();
    } else {
      profile = await Profile.create({
        user: req.user._id,
        age, gender, height, weight, goal, activityLevel,
        workoutPreference, dietaryPreference, allergies, injuries,
        budget, targetBodyParts, equipmentAvailable,
      });
    }

    // Mark profile as complete
    await User.findByIdAndUpdate(req.user._id, { profileComplete: true });

    res.json({ profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
