import { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Flame, Droplets, Plus, Minus, Check, ChevronRight, Trophy, Dumbbell,
  Utensils, Target, TrendingUp, Zap, Activity, Coffee, Sun, Moon, Cookie,
} from 'lucide-react';
import { MotionCard, ProgressRing, ProgressBar, Skeleton, Badge } from '../components/ui';
import PageWrapper from '../components/layout/PageWrapper';
import { fetchCurrentPlan } from '../store/slices/planSlice';
import { fetchDailyLog, toggleExercise, toggleMeal, updateWater } from '../store/slices/trackerSlice';
import { fetchProfile } from '../store/slices/profileSlice';
import { getToday, getDayOfWeek, getGreeting } from '../utils/helpers';
import BodyVisualization2D from '../components/BodyVisualization2D';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { plan, loading: planLoading } = useSelector((s) => s.plan);
  const { dailyLog } = useSelector((s) => s.tracker);
  const { profile } = useSelector((s) => s.profile);

  useEffect(() => {
    dispatch(fetchCurrentPlan());
    dispatch(fetchDailyLog(getToday()));
    dispatch(fetchProfile());
  }, [dispatch]);

  // Debug profile data
  useEffect(() => {
    console.log('Dashboard profile data:', profile);
  }, [profile]);

  const todayWorkout = plan?.workoutPlan?.find(
    (w) => w.day.toLowerCase() === getDayOfWeek().toLowerCase()
  );

  // ── Calculate accurate counts filtered by current plan ──
  const totalExercises = todayWorkout?.exercises?.length || 0;
  const completedExercises = dailyLog?.completedExercises?.filter(name =>
    todayWorkout?.exercises?.some(ex => ex.name === name)
  ).length || 0;

  const totalMeals = plan?.dietPlan?.length || 0;
  const completedMeals = dailyLog?.mealsConsumed?.filter(mealKey =>
    plan?.dietPlan?.some((meal, idx) => {
      const option = meal.options?.[0];
      return `${meal.mealType}-${option?.name || idx}` === mealKey;
    })
  ).length || 0;

  const waterIntake = dailyLog?.waterIntake || 0;
  const totalTasks = totalExercises + totalMeals;
  const completedTasks = completedExercises + completedMeals;

  // ── Calculate consumed macros based on meals checked off ──
  const consumedMacros = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  if (plan?.dietPlan && dailyLog?.mealsConsumed) {
    plan.dietPlan.forEach((meal, idx) => {
      const option = meal.options?.[0];
      if (!option) return;
      const mealKey = `${meal.mealType}-${option.name || idx}`;
      if (dailyLog.mealsConsumed.includes(mealKey)) {
        // Robust number conversion
        const cals = parseFloat(option.calories);
        const prot = parseFloat(option.protein);
        const carb = parseFloat(option.carbs);
        const fat = parseFloat(option.fats);
        
        consumedMacros.calories += isNaN(cals) ? 0 : cals;
        consumedMacros.protein += isNaN(prot) ? 0 : prot;
        consumedMacros.carbs += isNaN(carb) ? 0 : carb;
        consumedMacros.fats += isNaN(fat) ? 0 : fat;
      }
    });
  }

  const handleToggleExercise = useCallback((name) => {
    dispatch(toggleExercise({ date: getToday(), exerciseName: name }));
  }, [dispatch]);
  const handleToggleMeal = useCallback((name) => {
    dispatch(toggleMeal({ date: getToday(), mealName: name }));
  }, [dispatch]);
  const handleWater = useCallback((delta) => {
    dispatch(updateWater({ date: getToday(), delta }));
  }, [dispatch]);

  const WATER_MAX = 8;
  const waterPct = Math.min((waterIntake / WATER_MAX) * 100, 100);

  /* ── Loading skeleton ───────────────────────────── */
  if (planLoading) {
    return (
      <PageWrapper>
        <div className="space-y-8 p-2">
          <Skeleton className="h-10 w-72" />
          <div className="grid grid-cols-4 gap-6">
            <Skeleton className="h-52 col-span-2" />
            <Skeleton className="h-52" />
            <Skeleton className="h-52" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-10">

        {/* ── Header ─────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex items-end justify-between">
          <div>
            <p className="text-muted text-sm font-medium uppercase tracking-widest mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-[var(--text-main)] leading-none">
              {getGreeting()},{' '}
              <span className="text-gradient">{user?.name?.split(' ')[0] || 'Champion'}</span>
            </h1>
          </div>
          <Badge variant="primary" className="hidden md:flex">
            <Zap className="w-3 h-3 mr-1" /> Active Plan
          </Badge>
        </motion.div>

        {/* ══════════════════════════════════════════════
            BENTO GRID — asymmetric, spacious, alive
           ══════════════════════════════════════════════ */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 auto-rows-auto lg:auto-rows-[180px]"
        >
          {/* ── 1. Progress Ring (tall, spans 2 rows) ── */}
          <motion.div variants={fadeUp} className="md:col-span-1 lg:row-span-2 min-h-[250px] lg:min-h-0">
            <MotionCard glow className="h-full flex flex-col items-center justify-center gap-4">
              <ProgressRing value={completedTasks} max={totalTasks || 1} size={140} strokeWidth={12} />
              <p className="text-sm text-muted font-medium uppercase tracking-wider">Today's Progress</p>
            </MotionCard>
          </motion.div>

          {/* ── 2. Body Status (New 2D Viz) ── */}
          <motion.div variants={fadeUp} className="md:col-span-1 lg:row-span-2 min-h-[300px] lg:min-h-0">
             <MotionCard glow className="h-full flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-4 left-4 z-10">
                  <p className="text-sm font-bold text-[var(--text-main)] uppercase tracking-wider">Body Status</p>
                  <p className="text-xs text-muted">Strength & Focus</p>
                </div>
                <BodyVisualization2D 
                  strengthParts={profile?.strengthParts || ['Chest', 'Biceps']} 
                  weaknessParts={profile?.weaknessParts || ['Core', 'Calves']} 
                />
             </MotionCard>
          </motion.div>

          {/* ── 3. Exercises stat ──────────────────────── */}
          <motion.div variants={fadeUp} className="min-h-[160px] lg:min-h-0">
            <MotionCard className="h-full flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">Exercises</p>
                  <p className="text-2xl font-bold font-heading text-[var(--text-main)]">
                    {completedExercises}<span className="text-dim text-lg">/{totalExercises}</span>
                  </p>
                </div>
              </div>
              <ProgressBar value={completedExercises} max={totalExercises || 1} color="accent" showValue={false} />
            </MotionCard>
          </motion.div>

          {/* ── 3. Meals stat ─────────────────────────── */}
          <motion.div variants={fadeUp} className="min-h-[160px] lg:min-h-0">
            <MotionCard className="h-full flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-emerald/10 rounded-xl flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-emerald" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">Meals</p>
                  <p className="text-2xl font-bold font-heading text-[var(--text-main)]">
                    {completedMeals}<span className="text-dim text-lg">/{totalMeals}</span>
                  </p>
                </div>
              </div>
              <ProgressBar value={completedMeals} max={totalMeals || 1} color="green" showValue={false} />
            </MotionCard>
          </motion.div>

          {/* ── 4. Water tracker (interactive) ────────── */}
          <motion.div variants={fadeUp} className="min-h-[160px] lg:min-h-0">
            <MotionCard className="h-full flex flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-sky/10 rounded-xl flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-sky" />
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider">Water</p>
                  <p className="text-2xl font-bold font-heading text-[var(--text-main)]">
                    {waterIntake} <span className="text-dim text-base">/ {WATER_MAX}</span>
                  </p>
                </div>
              </div>

              {/* Glass dots */}
              <div className="flex items-center justify-center gap-1.5 my-2">
                {Array.from({ length: WATER_MAX }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      i < waterIntake ? 'bg-sky' : 'bg-surface-light'
                    }`}
                    animate={{ scale: i < waterIntake ? 1 : 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleWater(-1)}
                  disabled={waterIntake <= 0}
                  className="w-9 h-9 rounded-lg bg-surface-light flex items-center justify-center hover:bg-surface-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4 text-muted" />
                </motion.button>
                <div className="flex-1 h-2 bg-surface-light rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-sky rounded-full"
                    animate={{ width: `${waterPct}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleWater(1)}
                  disabled={waterIntake >= WATER_MAX}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    waterIntake >= WATER_MAX
                      ? 'bg-surface-light text-dim cursor-not-allowed opacity-30'
                      : 'bg-accent text-white hover:bg-accent-hover'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </MotionCard>
          </motion.div>

          {/* ── 5. Macro Goals (wide, spans 2 cols) ──── */}
          {plan?.macroGoals && (
            <motion.div variants={fadeUp} className="md:col-span-2 lg:col-span-3">
              <MotionCard hover={false} className="h-full">
                <div className="flex items-center gap-3 mb-5">
                  <Target className="w-5 h-5 text-violet" />
                  <h3 className="font-heading text-lg text-[var(--text-main)] uppercase tracking-wide">Macro Goals</h3>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { label: 'Calories', goal: plan.macroGoals.dailyCalories, consumed: consumedMacros.calories, unit: 'kcal', color: 'accent' },
                    { label: 'Protein', goal: plan.macroGoals.protein, consumed: consumedMacros.protein, unit: 'g', color: 'accent' },
                    { label: 'Carbs', goal: plan.macroGoals.carbs, consumed: consumedMacros.carbs, unit: 'g', color: 'amber' },
                    { label: 'Fats', goal: plan.macroGoals.fats, consumed: consumedMacros.fats, unit: 'g', color: 'emerald' },
                  ].map((m) => {
                    const goal = Number(m.goal) || 0;
                    const consumed = Number(m.consumed) || 0;
                    const pct = goal > 0 ? Math.min(Math.round((consumed / goal) * 100), 100) : 0;
                    
                    return (
                      <div key={m.label} className="relative group">
                        <div className="flex justify-between items-end mb-1">
                          <p className="text-[10px] text-muted uppercase tracking-widest font-bold">{m.label}</p>
                          <span className="text-[10px] font-bold text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                            {pct}%
                          </span>
                        </div>
                        <p className="text-2xl font-bold font-heading text-[var(--text-main)] leading-none mb-2">
                          {consumed}<span className="text-dim text-sm font-medium">/{goal}{m.unit}</span>
                        </p>
                        <div className="h-2 bg-surface-light rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            className={`h-full rounded-full ${
                              m.color === 'accent' ? 'bg-accent' : m.color === 'amber' ? 'bg-amber' : 'bg-emerald'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </MotionCard>
            </motion.div>
          )}
        </motion.div>

        {/* ══════════════════════════════════════════════
            FEATURE CARDS — Today's Workout + Meals
           ══════════════════════════════════════════════ */}
        <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Workout (large feature card — 3 cols) ── */}
          <motion.div variants={fadeUp} className="lg:col-span-3">
            <MotionCard hover={false} tap={false} className="h-full">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl text-[var(--text-main)] uppercase tracking-wide">
                      Today's Workout
                    </h2>
                    {todayWorkout && (
                      <p className="text-sm text-muted">{todayWorkout.focusArea}</p>
                    )}
                  </div>
                </div>
                {todayWorkout && <Badge variant="primary">{todayWorkout.day}</Badge>}
              </div>

              {!todayWorkout ? (
                <div className="text-center py-16">
                  <Trophy className="w-14 h-14 text-surface-light mx-auto mb-4" />
                  <p className="text-muted font-medium text-lg">Rest day — you've earned it.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayWorkout.exercises.map((ex, i) => {
                    const isDone = dailyLog?.completedExercises?.includes(ex.name);
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.985 }}
                        transition={{ duration: 0.08 }}
                        onClick={() => handleToggleExercise(ex.name)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-100 text-left group ${
                          isDone
                            ? 'bg-accent/5 border-accent/20'
                            : 'bg-surface-light/30 border-surface-border hover:border-surface-hover'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isDone ? 'bg-accent text-white' : 'bg-surface-light text-dim group-hover:text-[var(--text-main)]'
                        }`}>
                          {isDone ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm ${isDone ? 'text-accent line-through opacity-70' : 'text-[var(--text-main)]'}`}>
                            {ex.name}
                          </p>
                          <p className="text-xs text-dim">
                            {ex.sets} sets × {ex.reps} reps
                            {ex.restTime && ` · Rest: ${ex.restTime}`}
                            {ex.notes && ` · ${ex.notes}`}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-surface-light group-hover:text-muted flex-shrink-0 transition-colors" />
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </MotionCard>
          </motion.div>

          {/* ── Meals (2 cols) ─────────────────────────── */}
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <MotionCard hover={false} tap={false} className="h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald/10 rounded-2xl flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-emerald" />
                </div>
                <h2 className="font-heading text-xl text-[var(--text-main)] uppercase tracking-wide">
                  Today's Meals
                </h2>
              </div>

              {!plan?.dietPlan?.length ? (
                <div className="text-center py-16">
                  <Utensils className="w-14 h-14 text-surface-light mx-auto mb-4" />
                  <p className="text-muted font-medium">No diet plan yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {plan.dietPlan.map((meal, i) => {
                    const option = meal.options?.[0];
                    const mealKey = `${meal.mealType}-${option?.name || i}`;
                    const isDone = dailyLog?.mealsConsumed?.includes(mealKey);
                    const mealIcons = { breakfast: Coffee, lunch: Sun, dinner: Moon, snack: Cookie };
                    const MealIcon = mealIcons[meal.mealType?.toLowerCase()] || Utensils;
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.985 }}
                        transition={{ duration: 0.08 }}
                        onClick={() => handleToggleMeal(mealKey)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-100 text-left group ${
                          isDone
                            ? 'bg-emerald/5 border-emerald/20'
                            : 'bg-surface-light/30 border-surface-border hover:border-surface-hover'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isDone ? 'bg-emerald text-white' : 'bg-surface-light text-dim'
                        }`}>
                          {isDone ? <Check className="w-4 h-4" /> : <MealIcon className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-dim uppercase tracking-widest">
                            {meal.mealType}
                          </p>
                          <p className={`font-semibold text-sm mt-0.5 ${isDone ? 'text-emerald line-through opacity-70' : 'text-[var(--text-main)]'}`}>
                            {option?.name || 'Meal option'}
                          </p>
                          {(option?.calories != null || option?.quantity) && (
                            <p className="text-xs text-muted mt-0.5">
                              {option.quantity && `${option.quantity} · `}
                              {option.calories != null && `${option.calories} cal · `}
                              {option.protein != null && `${option.protein}g P`}
                              {option.carbs != null && ` · ${option.carbs}g C`}
                              {option.fats != null && ` · ${option.fats}g F`}
                            </p>
                          )}
                          {option?.contraindications?.length > 0 && (
                            <p className="text-[10px] text-accent font-bold mt-1 uppercase tracking-wider flex items-center gap-1">
                              <span>⚠️ Avoid if:</span> <span className="opacity-80">{option.contraindications.join(', ')}</span>
                            </p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </MotionCard>
          </motion.div>
        </motion.div>

      </motion.div>
    </PageWrapper>
  );
}
