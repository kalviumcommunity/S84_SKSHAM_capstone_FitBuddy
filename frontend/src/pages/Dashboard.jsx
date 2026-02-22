import { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Droplets, Plus, Minus, Check, ChevronRight, Trophy, Dumbbell,
  Utensils, Target, TrendingUp, Zap, Activity, Coffee, Sun, Moon, Cookie, Trash2, Clock
} from 'lucide-react';
import { MotionCard, ProgressRing, ProgressBar, Skeleton, Badge, Input, Button } from '../components/ui';
import PageWrapper from '../components/layout/PageWrapper';
import { fetchCurrentPlan } from '../store/slices/planSlice';
import { fetchDailyLog, toggleExercise, toggleMeal, updateWater, addActualMeal, removeActualMeal } from '../store/slices/trackerSlice';
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

  const [newMealName, setNewMealName] = useState('');
  const [newMealCals, setNewMealCals] = useState('');
  const [newMealProtein, setNewMealProtein] = useState('');
  const [newMealCarbs, setNewMealCarbs] = useState('');
  const [newMealFats, setNewMealFats] = useState('');
  const [showMealForm, setShowMealForm] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentPlan());
    dispatch(fetchDailyLog(getToday()));
    dispatch(fetchProfile());
  }, [dispatch]);



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

  // ── Calculate macros from actual log (Other items) ──
  const actualConsumedMacros = { calories: 0, protein: 0, carbs: 0, fats: 0 };
  if (dailyLog?.actualMeals) {
    dailyLog.actualMeals.forEach(m => {
      actualConsumedMacros.calories += Number(m.calories) || 0;
      actualConsumedMacros.protein += Number(m.protein) || 0;
      actualConsumedMacros.carbs += Number(m.carbs) || 0;
      actualConsumedMacros.fats += Number(m.fats) || 0;
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

  const handleAddActualMeal = async (e) => {
    e.preventDefault();
    if (!newMealName.trim()) return;

    const cals = parseInt(newMealCals) || 0;
    const prot = parseInt(newMealProtein) || 0;
    const carb = parseInt(newMealCarbs) || 0;
    const fat  = parseInt(newMealFats) || 0;

    // If ALL macro fields are empty/zero, AI will estimate on the backend
    const willAiEstimate = cals === 0 && prot === 0 && carb === 0 && fat === 0;
    if (willAiEstimate) setIsEstimating(true);

    try {
      const meal = {
        name: newMealName.trim(),
        calories: cals,
        protein: prot,
        carbs: carb,
        fats: fat,
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      };

      const result = await dispatch(addActualMeal({ date: getToday(), meal })).unwrap();
      
      setNewMealName('');
      setNewMealCals('');
      setNewMealProtein('');
      setNewMealCarbs('');
      setNewMealFats('');
      setShowMealForm(false);
    } catch (err) {
      alert('Failed to add meal: ' + (err || 'Unknown error'));
    } finally {
      setIsEstimating(false);
    }
  };

  const handleRemoveActualMeal = (id) => {
    dispatch(removeActualMeal({ date: getToday(), mealId: id }));
  };

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
                  <h2 className="font-heading text-xl text-[var(--text-main)] uppercase tracking-wide">Macro Analytics</h2>
                </div>
                <div className="grid grid-cols-4 gap-6">
                  {[
                    { label: 'Energy', goal: plan.macroGoals.dailyCalories, consumed: consumedMacros.calories, other: actualConsumedMacros.calories, unit: 'kcal', color: 'accent', icon: Flame },
                    { label: 'Protein', goal: plan.macroGoals.protein, consumed: consumedMacros.protein, other: actualConsumedMacros.protein, unit: 'g', color: 'accent', icon: Zap },
                    { label: 'Carbs', goal: plan.macroGoals.carbs, consumed: consumedMacros.carbs, other: actualConsumedMacros.carbs, unit: 'g', color: 'amber', icon: Activity },
                    { label: 'Fats', goal: plan.macroGoals.fats, consumed: consumedMacros.fats, other: actualConsumedMacros.fats, unit: 'g', color: 'emerald', icon: Droplets },
                  ].map((m) => {
                    const goal = Number(m.goal) || 0;
                    const consumed = Number(m.consumed) || 0;
                    const other = Number(m.other) || 0;
                    const total = consumed + other;
                    const pctPlanned = goal > 0 ? Math.min(Math.round((consumed / goal) * 100), 100) : 0;
                    const pctOther = goal > 0 ? Math.min(Math.round((other / goal) * 100), (100 - pctPlanned)) : 0;
                    const totalPct = goal > 0 ? Math.round((total / goal) * 100) : 0;
                    
                    return (
                      <div key={m.label} className="relative group">
                        <div className="flex justify-between items-end mb-1">
                          <div className="flex items-center gap-1.5">
                            <m.icon className={`w-3 h-3 ${m.color === 'accent' ? 'text-accent' : m.color === 'amber' ? 'text-amber' : 'text-emerald'}`} />
                            <p className="text-[10px] text-muted uppercase tracking-widest font-bold">{m.label}</p>
                          </div>
                          <span className={`text-[10px] font-bold ${totalPct > 100 ? 'text-accent' : 'text-muted'}`}>
                            {totalPct}%
                          </span>
                        </div>
                        <p className="text-2xl font-bold font-heading text-[var(--text-main)] leading-none mb-1">
                          {total}<span className="text-dim text-sm font-medium">/{goal}{m.unit}</span>
                        </p>
                        {other > 0 && (
                          <p className="text-[9px] text-accent font-bold mb-1 opacity-80 animate-pulse">
                            Other: +{other}
                          </p>
                        )}
                        <div className="h-2 bg-surface-light rounded-full overflow-hidden shadow-inner flex">
                          <motion.div
                            className={`h-full ${
                              m.color === 'accent' ? 'bg-accent' : m.color === 'amber' ? 'bg-amber' : 'bg-emerald'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pctPlanned}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                          <motion.div
                            className={`h-full opacity-40 ${
                              m.color === 'accent' ? 'bg-accent-hover' : m.color === 'amber' ? 'bg-amber' : 'bg-emerald'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pctOther}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
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
            <MotionCard hover={false} tap={false} className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald/10 rounded-2xl flex items-center justify-center">
                    <Utensils className="w-6 h-6 text-emerald" />
                  </div>
                  <h2 className="font-heading text-xl text-[var(--text-main)] uppercase tracking-wide">
                    Nutrition
                  </h2>
                </div>
                <div className="flex gap-1.5 md:gap-2">
                   <div className="flex flex-col items-center px-1.5 md:px-2 py-1 bg-surface-light/50 rounded-lg">
                      <span className="text-[7px] md:text-[8px] text-muted font-bold uppercase">Protein</span>
                      <span className="text-[9px] md:text-[10px] font-bold text-accent">{consumedMacros.protein + actualConsumedMacros.protein}g</span>
                   </div>
                   <div className="flex flex-col items-center px-1.5 md:px-2 py-1 bg-surface-light/50 rounded-lg">
                      <span className="text-[7px] md:text-[8px] text-muted font-bold uppercase">Carbs</span>
                      <span className="text-[9px] md:text-[10px] font-bold text-amber">{consumedMacros.carbs + actualConsumedMacros.carbs}g</span>
                   </div>
                   <div className="flex flex-col items-center px-1.5 md:px-2 py-1 bg-surface-light/50 rounded-lg">
                      <span className="text-[8px] text-muted font-bold uppercase">Fats</span>
                      <span className="text-[9px] md:text-[10px] font-bold text-emerald">{consumedMacros.fats + actualConsumedMacros.fats}g</span>
                   </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowMealForm(!showMealForm)}
                  className="text-xs ml-auto"
                >
                  {showMealForm ? 'Cancel' : 'Log Actual'}
                </Button>
              </div>

              {/* Log Actual Meal Form */}
              <AnimatePresence>
                {showMealForm && (
                  <motion.form 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleAddActualMeal}
                    className="mb-6 space-y-3 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Input 
                        placeholder="What did you eat?" 
                        value={newMealName} 
                        onChange={(e) => setNewMealName(e.target.value)}
                        className="text-xs py-1 h-9 col-span-2"
                        disabled={isEstimating}
                      />
                      <Input 
                        type="number" 
                        placeholder="Calories" 
                        value={newMealCals} 
                        onChange={(e) => setNewMealCals(e.target.value)}
                        className="text-xs py-1 h-9"
                        disabled={isEstimating}
                      />
                      <Input 
                        type="number" 
                        placeholder="Protein (g)" 
                        value={newMealProtein} 
                        onChange={(e) => setNewMealProtein(e.target.value)}
                        className="text-xs py-1 h-9"
                        disabled={isEstimating}
                      />
                      <Input 
                        type="number" 
                        placeholder="Carbohydrates (g)" 
                        value={newMealCarbs} 
                        onChange={(e) => setNewMealCarbs(e.target.value)}
                        className="text-xs py-1 h-9"
                        disabled={isEstimating}
                      />
                      <Input 
                        type="number" 
                        placeholder="Fats (g)" 
                        value={newMealFats} 
                        onChange={(e) => setNewMealFats(e.target.value)}
                        className="text-xs py-1 h-9"
                        disabled={isEstimating}
                      />
                    </div>
                    {!newMealCals && !newMealProtein && !newMealCarbs && !newMealFats && (
                      <p className="text-[9px] text-muted text-center italic">
                        Leave fields empty for AI estimation
                      </p>
                    )}
                    <Button 
                      type="submit" 
                      size="sm" 
                      className="w-full h-9 text-xs"
                      disabled={isEstimating || !newMealName.trim()}
                    >
                      {isEstimating ? (
                        <>
                          <Zap className="w-3 h-3 mr-2 animate-pulse text-yellow-400" />
                          Estimating Macros...
                        </>
                      ) : 'Add to Log'}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="flex-1 space-y-6 overflow-y-auto pr-1 custom-scrollbar">
                {/* Planned Meals Section */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest px-1">Planned Meals</p>
                  {!plan?.dietPlan?.length ? (
                    <div className="text-center py-8 bg-surface-light/20 rounded-xl border border-dashed border-surface-border">
                      <p className="text-xs text-muted font-medium">No diet plan yet.</p>
                    </div>
                  ) : (
                    plan.dietPlan.map((meal, i) => {
                      const option = meal.options?.[0];
                      const mealKey = `${meal.mealType}-${option?.name || i}`;
                      const isDone = dailyLog?.mealsConsumed?.includes(mealKey);
                      const mealIcons = { breakfast: Coffee, lunch: Sun, dinner: Moon, snack: Cookie };
                      const MealIcon = mealIcons[meal.mealType?.toLowerCase()] || Utensils;
                      return (
                        <div key={i} className="space-y-2">
                          <motion.button
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
                              <div className="mt-1.5 space-y-2">
                                <div className="flex items-center gap-2">
                                  {option.quantity ? (
                                    <span className="inline-flex items-center gap-1 bg-amber/15 px-3 py-1.5 rounded-lg border border-amber/30">
                                      <span className="text-xs font-bold text-amber">Qty:</span>
                                      <span className="text-sm font-bold text-amber">{option.quantity}</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 bg-amber/15 px-3 py-1.5 rounded-lg border border-amber/30">
                                      <span className="text-xs font-bold text-amber">Qty:</span>
                                      <span className="text-sm font-bold text-amber">--</span>
                                    </span>
                                  )}
                                  {option.calories != null && (
                                    <span className="text-lg font-bold text-accent">
                                      {option.calories} kcal
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-dim font-medium flex flex-wrap gap-1.5">
                                  <span className="inline-block bg-surface-light/50 px-2.5 py-1 rounded-md">P: {option.protein ?? 0}g</span>
                                  <span className="inline-block bg-surface-light/50 px-2.5 py-1 rounded-md">C: {option.carbs ?? 0}g</span>
                                  <span className="inline-block bg-surface-light/50 px-2.5 py-1 rounded-md">F: {option.fats ?? 0}g</span>
                                </p>
                              </div>
                              {option?.contraindications?.length > 0 && (
                                <p className="text-[10px] text-accent font-bold mt-1 uppercase tracking-wider flex items-center gap-1">
                                  <span>⚠️ Avoid if:</span> <span className="opacity-80">{option.contraindications.join(', ')}</span>
                                </p>
                              )}
                            </div>
                          </motion.button>
                          
                          {/* Ingredients display (New) */}
                          <AnimatePresence>
                            {!isDone && option?.ingredients?.length > 0 && (
                              <motion.div 
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="ml-12 grid grid-cols-1 gap-1.5 pl-4 border-l-2 border-emerald/10"
                              >
                                {option.ingredients.map((ing, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-[11px] text-muted">
                                    <span className="capitalize">{typeof ing === 'string' ? ing : ing.name}</span>
                                    <span className="font-medium text-dim">{typeof ing === 'string' ? '' : ing.quantity}</span>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Actual Food Log Section (Side-by-side / Below) */}
                {dailyLog?.actualMeals?.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Actual Consumption (Other)</p>
                      <div className="text-[10px] font-bold text-accent">
                        Total: {actualConsumedMacros.calories} kcal
                      </div>
                    </div>
                    <div className="space-y-2">
                      {dailyLog.actualMeals.map((meal, idx) => (
                        <motion.div 
                          key={meal._id || idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 rounded-xl bg-surface-light/40 border border-surface-border group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center text-muted">
                              <Clock className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[var(--text-main)]">{meal.name}</p>
                              <p className="text-[10px] text-muted mb-1">{meal.time}</p>
                              <div className="flex gap-1.5 flex-wrap">
                                <span className="inline-block bg-accent/10 px-2 py-0.5 rounded text-[9px] font-medium text-accent">
                                  {meal.calories || 0} kcal
                                </span>
                                <span className="inline-block bg-surface-light/50 px-2 py-0.5 rounded text-[9px] font-medium text-dim">
                                  P: {meal.protein || 0}g
                                </span>
                                <span className="inline-block bg-surface-light/50 px-2 py-0.5 rounded text-[9px] font-medium text-dim">
                                  C: {meal.carbs || 0}g
                                </span>
                                <span className="inline-block bg-surface-light/50 px-2 py-0.5 rounded text-[9px] font-medium text-dim">
                                  F: {meal.fats || 0}g
                                </span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemoveActualMeal(meal._id)}
                            className="bg-transparent text-muted hover:text-accent transition-colors opacity-0 group-hover:opacity-100 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </MotionCard>
          </motion.div>
        </motion.div>

      </motion.div>
    </PageWrapper>
  );
}
