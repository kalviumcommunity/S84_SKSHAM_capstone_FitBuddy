import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dumbbell, Utensils, RefreshCw, ChevronDown, ChevronUp,
  Calendar, Flame, Zap,
} from 'lucide-react';
import { MotionCard, Button, Badge, Skeleton } from '../components/ui';
import PageWrapper from '../components/layout/PageWrapper';
import { fetchCurrentPlan, generatePlan } from '../store/slices/planSlice';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Plan() {
  const dispatch = useDispatch();
  const { plan, loading, generating } = useSelector((s) => s.plan);
  const [tab, setTab] = useState('workout');
  const [openDay, setOpenDay] = useState(null);

  useEffect(() => {
    dispatch(fetchCurrentPlan());
  }, [dispatch]);

  const handleRegenerate = () => dispatch(generatePlan());

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-6">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-64" count={2} />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-10">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-[var(--text-main)] uppercase">My Plan</h1>
            <p className="text-muted mt-1">Your AI-generated fitness programme</p>
          </div>
          <Button onClick={handleRegenerate} loading={generating} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" /> Regenerate
          </Button>
        </motion.div>

        {/* Tab toggle */}
        <motion.div variants={fadeUp} className="flex bg-surface border border-surface-border rounded-xl p-1 w-fit">
          {['workout', 'diet'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                tab === t ? 'text-[var(--text-main)]' : 'text-dim hover:text-muted'
              }`}
            >
              {tab === t && (
                <motion.div
                  layoutId="plan-tab"
                  className="absolute inset-0 bg-accent/15 border border-accent/25 rounded-lg"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2">
                {t === 'workout' ? <Dumbbell className="w-4 h-4" /> : <Utensils className="w-4 h-4" />}
                {t === 'workout' ? 'Workout' : 'Diet'}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {tab === 'workout' ? (
            <motion.div
              key="workout"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {!plan?.workoutPlan?.length ? (
                <MotionCard className="text-center py-20">
                  <Dumbbell className="w-14 h-14 text-surface-light mx-auto mb-4" />
                  <p className="text-muted text-lg font-medium">No workout plan yet.</p>
                  <p className="text-dim text-sm mt-1">Go to your profile and generate a plan.</p>
                </MotionCard>
              ) : (
                plan.workoutPlan.map((day, idx) => {
                  const isOpen = openDay === idx;
                  return (
                    <MotionCard
                      key={idx}
                      hover={false}
                      tap={false}
                      delay={idx * 0.05}
                      className="!p-0 overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenDay(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-6 text-left group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <p className="font-heading font-bold text-[var(--text-main)] text-lg uppercase tracking-wide">
                              {day.day}
                            </p>
                            <p className="text-sm text-muted">{day.focusArea || 'General'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="default">{day.exercises?.length || 0} exercises</Badge>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-dim" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-dim" />
                          )}
                        </div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 space-y-3 border-t border-surface-border pt-4">
                              {day.exercises?.map((ex, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-4 p-3 rounded-xl bg-surface-light/30"
                                >
                                  <span className="w-8 h-8 rounded-lg bg-surface-light flex items-center justify-center text-xs font-bold text-muted">
                                    {i + 1}
                                  </span>
                                  <div className="flex-1">
                                    <p className="font-semibold text-sm text-[var(--text-main)]">{ex.name}</p>
                                    <p className="text-xs text-dim">
                                      {ex.sets} sets × {ex.reps} reps
                                      {ex.notes && ` · ${ex.notes}`}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </MotionCard>
                  );
                })
              )}
            </motion.div>
          ) : (
            <motion.div
              key="diet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {!plan?.dietPlan?.length ? (
                <MotionCard className="text-center py-20">
                  <Utensils className="w-14 h-14 text-surface-light mx-auto mb-4" />
                  <p className="text-muted text-lg font-medium">No diet plan yet.</p>
                </MotionCard>
              ) : (
                plan.dietPlan.map((meal, idx) => (
                  <MotionCard key={idx} delay={idx * 0.05}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-emerald/10 rounded-xl flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-emerald" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-dim uppercase tracking-widest">{meal.mealType}</p>
                        <p className="text-[var(--text-main)] font-heading font-semibold uppercase">{meal.options?.[0]?.name || 'Meal'}</p>
                      </div>
                    </div>
                    {meal.options?.map((opt, oi) => (
                      <div key={oi} className="bg-surface-light/30 rounded-xl p-4 mb-2 last:mb-0">
                        <p className="text-sm font-semibold text-[var(--text-main)] mb-2">{opt.name}</p>
                        {opt.calories && (
                          <div className="flex gap-4 text-xs text-muted">
                            <span><Flame className="w-3 h-3 inline mr-1 text-accent" />{opt.calories} cal</span>
                            <span>{opt.protein}g protein</span>
                            {opt.carbs && <span>{opt.carbs}g carbs</span>}
                            {opt.fats && <span>{opt.fats}g fats</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </MotionCard>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageWrapper>
  );
}
