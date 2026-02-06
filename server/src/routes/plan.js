import { Router } from 'express';
import Plan from '../models/Plan.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { generateFitnessPlan } from '../services/groqService.js';

const router = Router();

// POST /api/plan/generate
router.post('/generate', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(400).json({ message: 'Please complete your profile first' });
    }

    // Archive old plans
    await Plan.updateMany(
      { user: req.user._id, status: 'active' },
      { status: 'archived' }
    );

    // Generate via Groq AI
    const aiPlan = await generateFitnessPlan(profile);

    // Save new plan
    const plan = await Plan.create({
      user: req.user._id,
      workoutPlan: aiPlan.workoutPlan,
      dietPlan: aiPlan.dietPlan,
      macroGoals: aiPlan.macroGoals,
      status: 'active',
    });

    // Update user's current plan reference
    await User.findByIdAndUpdate(req.user._id, { currentPlanId: plan._id });

    res.status(201).json({ plan });
  } catch (error) {
    console.error('Generate plan error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate plan' });
  }
});

// GET /api/plan/current
router.get('/current', auth, async (req, res) => {
  try {
    const plan = await Plan.findOne({ user: req.user._id, status: 'active' }).sort({ createdAt: -1 });
    if (!plan) {
      return res.status(404).json({ message: 'No active plan', plan: null });
    }
    res.json({ plan });
  } catch (error) {
    console.error('Fetch plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
