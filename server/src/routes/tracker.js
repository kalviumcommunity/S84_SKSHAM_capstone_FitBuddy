import { Router } from 'express';
import DailyLog from '../models/DailyLog.js';
import auth from '../middleware/auth.js';

const router = Router();

// Helper: get or create daily log
const getOrCreateLog = async (userId, date) => {
  let log = await DailyLog.findOne({ user: userId, date });
  if (!log) {
    log = await DailyLog.create({
      user: userId,
      date,
      completedExercises: [],
      mealsConsumed: [],
      waterIntake: 0,
    });
  }
  return log;
};

// GET /api/tracker/:date
router.get('/:date', auth, async (req, res) => {
  try {
    const log = await getOrCreateLog(req.user._id, req.params.date);
    res.json({ log });
  } catch (error) {
    console.error('Fetch daily log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tracker/exercise
router.post('/exercise', auth, async (req, res) => {
  try {
    const { date, exerciseName } = req.body;
    const log = await getOrCreateLog(req.user._id, date);

    const index = log.completedExercises.indexOf(exerciseName);
    if (index > -1) {
      log.completedExercises.splice(index, 1);
    } else {
      log.completedExercises.push(exerciseName);
    }

    await log.save();
    res.json({ log });
  } catch (error) {
    console.error('Toggle exercise error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tracker/meal
router.post('/meal', auth, async (req, res) => {
  try {
    const { date, mealName } = req.body;
    const log = await getOrCreateLog(req.user._id, date);

    const index = log.mealsConsumed.indexOf(mealName);
    if (index > -1) {
      log.mealsConsumed.splice(index, 1);
    } else {
      log.mealsConsumed.push(mealName);
    }

    await log.save();
    res.json({ log });
  } catch (error) {
    console.error('Toggle meal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tracker/water
router.post('/water', auth, async (req, res) => {
  try {
    const { date, delta } = req.body;
    const log = await getOrCreateLog(req.user._id, date);

    log.waterIntake = Math.max(0, log.waterIntake + delta);
    await log.save();

    res.json({ log });
  } catch (error) {
    console.error('Update water error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
