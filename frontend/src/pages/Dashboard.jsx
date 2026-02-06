import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Flame, Droplets, Plus, Minus, Check, ChevronRight, Trophy, Dumbbell,
  Utensils, Target, TrendingUp, Zap, Activity,
} from 'lucide-react';
import { MotionCard, ProgressRing, ProgressBar, Skeleton, Badge } from '../components/ui';
import PageWrapper from '../components/layout/PageWrapper';
import { fetchCurrentPlan } from '../store/slices/planSlice';
import { fetchDailyLog, toggleExercise, toggleMeal, updateWater } from '../store/slices/trackerSlice';
import { getToday, getDayOfWeek, getGreeting } from '../utils/helpers';

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

  useEffect(() => {
    dispatch(fetchCurrentPlan());
    dispatch(fetchDailyLog(getToday()));
  }, [dispatch]);

  const todayWorkout = plan?.workoutPlan?.find(
    (w) => w.day.toLowerCase() === getDayOfWeek().toLowerCase()
  );

  const totalExercises = todayWorkout?.exercises?.length || 0;
  const completedExercises = dailyLog?.completedExercises?.length || 0;
  const totalMeals = plan?.dietPlan?.length || 0;
  const completedMeals = dailyLog?.mealsConsumed?.length || 0;
  const waterIntake = dailyLog?.waterIntake || 0;
  const totalTasks = totalExercises + totalMeals;
  const completedTasks = completedExercises + completedMeals;

  const handleToggleExercise = (name) => dispatch(toggleExercise({ date: getToday(), exerciseName: name }));
  const handleToggleMeal = (name) => dispatch(toggleMeal({ date: getToday(), mealName: name }));
  const handleWater = (delta) => dispatch(updateWater({ date: getToday(), delta }));

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-auto lg:auto-rows-[180px]"
        >
          {/* ── 1. Progress Ring (tall, spans 2 rows) ── */}
          <motion.div variants={fadeUp} className="md:col-span-1 lg:row-span-2 min-h-[250px] lg:min-h-0">
            <MotionCard glow className="h-full flex flex-col items-center justify-center gap-4">
              <ProgressRing value={completedTasks} max={totalTasks || 1} size={140} strokeWidth={12} />
              <p className="text-sm text-muted font-medium uppercase tracking-wider">Today's Progress</p>
            </MotionCard>
          </motion.div>

          {/* ── 2. Exercises stat ──────────────────────── */}
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
                    {waterIntake} <span className="text-dim text-base">/ 8</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleWater(-1)}
                  disabled={waterIntake <= 0}
                  className="w-9 h-9 rounded-lg bg-surface-light flex items-center justify-center hover:bg-surface-hover transition-colors disabled:opacity-30"
                >
                  <Minus className="w-4 h-4 text-muted" />
                </motion.button>
                <div className="flex-1 h-2 bg-surface-light rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-sky rounded-full"
                    animate={{ width: `${Math.min((waterIntake / 8) * 100, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => handleWater(1)}
                  className="w-9 h-9 rounded-lg bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-colors"
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
                    { label: 'Calories', val: plan.macroGoals.dailyCalories, unit: 'kcal', color: 'accent' },
                    { label: 'Protein', val: `${plan.macroGoals.protein}g`, unit: '', color: 'accent' },
                    { label: 'Carbs', val: `${plan.macroGoals.carbs}g`, unit: '', color: 'amber' },
                    { label: 'Fats', val: `${plan.macroGoals.fats}g`, unit: '', color: 'green' },
                  ].map((m) => (
                    <div key={m.label}>
                      <p className="text-xs text-muted uppercase tracking-wider mb-1">{m.label}</p>
                      <p className="text-2xl font-bold font-heading text-[var(--text-main)]">{m.val}</p>
                      {m.unit && <p className="text-xs text-dim">{m.unit}</p>}
                    </div>
                  ))}
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
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleToggleExercise(ex.name)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left group ${
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
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleToggleMeal(mealKey)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left group ${
                          isDone
                            ? 'bg-emerald/5 border-emerald/20'
                            : 'bg-surface-light/30 border-surface-border hover:border-surface-hover'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                          isDone ? 'bg-emerald text-white' : 'bg-surface-light text-dim'
                        }`}>
                          {isDone ? <Check className="w-4 h-4" /> : <Utensils className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-dim uppercase tracking-widest">
                            {meal.mealType}
                          </p>
                          <p className={`font-semibold text-sm mt-0.5 ${isDone ? 'text-emerald line-through opacity-70' : 'text-[var(--text-main)]'}`}>
                            {option?.name || 'Meal option'}
                          </p>
                          {option?.calories && (
                            <p className="text-xs text-dim mt-0.5">
                              {option.calories} cal · {option.protein}g protein
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
