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
      budget, targetBodyParts, equipmentAvailable, country,
      strengthParts, weaknessParts,
    } = req.body;

    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      Object.assign(profile, {
        age, gender, height, weight, goal, activityLevel,
        workoutPreference, dietaryPreference, allergies, injuries,
        budget, targetBodyParts, equipmentAvailable, country,
        strengthParts, weaknessParts,
      });
      await profile.save();
    } else {
      profile = await Profile.create({
        user: req.user._id,
        age, gender, height, weight, goal, activityLevel,
        workoutPreference, dietaryPreference, allergies, injuries,
        budget, targetBodyParts, equipmentAvailable, country,
        strengthParts, weaknessParts,
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

// PUT /api/profile/avatar — upload profile picture (base64)
router.put('/avatar', auth, async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) return res.status(400).json({ message: 'No avatar provided' });

    // Limit size ~2MB base64
    if (avatar.length > 2_800_000) {
      return res.status(400).json({ message: 'Image too large. Max 2 MB.' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true }
    ).select('-password');

    res.json({ user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar, authProvider: user.authProvider, profileComplete: user.profileComplete } });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
