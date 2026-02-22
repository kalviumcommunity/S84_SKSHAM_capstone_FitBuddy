import { Router } from 'express';
import DailyLog from '../models/DailyLog.js';
import auth from '../middleware/auth.js';
import { estimateMacros } from '../services/groqService.js';

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
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tracker/actual-meal
router.post('/actual-meal', auth, async (req, res) => {
  try {
    const { date, meal: mealData } = req.body;
    let meal = { ...mealData }; // Clone to avoid direct mutation
    const log = await getOrCreateLog(req.user._id, date);

    // Normalize incoming numbers
    meal.calories = Number(meal.calories) || 0;
    meal.protein = Number(meal.protein) || 0;
    meal.carbs = Number(meal.carbs) || 0;
    meal.fats = Number(meal.fats) || 0;



    // If all macros are 0, request AI estimation
    if (meal.calories === 0 && meal.protein === 0 && meal.carbs === 0 && meal.fats === 0) {
      try {
        const estimation = await estimateMacros(meal.name);
        
        meal.calories = estimation.calories || 0;
        meal.protein = estimation.protein || 0;
        meal.carbs = estimation.carbs || 0;
        meal.fats = estimation.fats || 0;
      } catch (estError) {
        // Silent fail for estimation
      }
    }

    log.actualMeals.push(meal);
    await log.save();

    res.json({ log });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/tracker/actual-meal/:id
router.delete('/actual-meal/:date/:mealId', auth, async (req, res) => {
  try {
    const { date, mealId } = req.params;
    const log = await DailyLog.findOne({ user: req.user._id, date });
    if (!log) return res.status(404).json({ message: 'Log not found' });

    log.actualMeals = log.actualMeals.filter(m => m._id.toString() !== mealId);
    await log.save();

    res.json({ log });
  } catch (error) {
    console.error('Delete actual meal error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/tracker/water
router.post('/water', auth, async (req, res) => {
  try {
    const { date, delta } = req.body;
    const log = await getOrCreateLog(req.user._id, date);

    // Clamp between 0 and 8 glasses
    log.waterIntake = Math.max(0, Math.min(8, log.waterIntake + delta));
    await log.save();

    res.json({ log });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
