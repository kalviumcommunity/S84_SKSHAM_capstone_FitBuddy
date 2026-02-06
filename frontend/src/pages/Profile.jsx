import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Shield, Edit3, Save, X, RefreshCw,
  Ruler, Weight, Target, Activity, Flame,
} from 'lucide-react';
import { MotionCard, Button, Input, Badge, Skeleton } from '../components/ui';
import PageWrapper from '../components/layout/PageWrapper';
import { fetchProfile, updateProfile } from '../store/slices/profileSlice';
import { generatePlan } from '../store/slices/planSlice';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const FIELD_META = [
  { key: 'age', label: 'Age', icon: User, type: 'number' },
  { key: 'height', label: 'Height (cm)', icon: Ruler, type: 'number' },
  { key: 'weight', label: 'Weight (kg)', icon: Weight, type: 'number' },
  { key: 'gender', label: 'Gender', icon: User, type: 'select', options: ['male', 'female', 'other'] },
  { key: 'fitnessLevel', label: 'Fitness Level', icon: Activity, type: 'select', options: ['beginner', 'intermediate', 'advanced'] },
  { key: 'goal', label: 'Goal', icon: Target, type: 'select', options: ['lose_weight', 'build_muscle', 'maintain', 'improve_endurance'] },
  { key: 'activityLevel', label: 'Activity Level', icon: Flame, type: 'select', options: ['sedentary', 'light', 'moderate', 'active', 'very_active'] },
];

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { profile, loading, updating } = useSelector((s) => s.profile);
  const { generating } = useSelector((s) => s.plan);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const handleSave = async () => {
    await dispatch(updateProfile(form));
    setEditing(false);
  };

  const handleGeneratePlan = () => dispatch(generatePlan());

  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-6">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-40" />
          <Skeleton className="h-80" />
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-10 max-w-3xl">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-[var(--text-main)] uppercase">Profile</h1>
            <p className="text-muted mt-1">Account &amp; fitness settings</p>
          </div>
        </motion.div>

        {/* Account card */}
        <MotionCard delay={0.05}>
          <p className="text-xs font-bold text-dim uppercase tracking-widest mb-5">Account</p>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
              <User className="w-7 h-7 text-accent" />
            </div>
            <div>
              <p className="text-xl font-heading font-bold text-[var(--text-main)]">{user?.name || 'Athlete'}</p>
              <p className="text-muted text-sm flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {user?.email}
              </p>
              {user?.authProvider && (
                <Badge variant="default" className="mt-2">
                  <Shield className="w-3 h-3" /> {user.authProvider}
                </Badge>
              )}
            </div>
          </div>
        </MotionCard>

        {/* Fitness profile card */}
        <MotionCard delay={0.1}>
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold text-dim uppercase tracking-widest">Fitness Profile</p>
            {!editing ? (
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                <Edit3 className="w-4 h-4" /> Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setForm(profile); }}>
                  <X className="w-4 h-4" /> Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSave} loading={updating}>
                  <Save className="w-4 h-4" /> Save
                </Button>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
              >
                {FIELD_META.map(({ key, label, icon: Icon }) => (
                  <div key={key} className="bg-surface-light/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-dim mb-1">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
                    </div>
                    <p className="text-[var(--text-main)] font-semibold">
                      {profile?.[key] ?? <span className="text-dim">—</span>}
                    </p>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {FIELD_META.map(({ key, label, icon: Icon, type, options }) => (
                  <div key={key}>
                    {type === 'select' ? (
                      <div>
                        <label className="block text-xs text-muted uppercase tracking-wider font-semibold mb-2">{label}</label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dim pointer-events-none" />
                          <select
                            value={form[key] || ''}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-3 text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:border-accent appearance-none"
                          >
                            <option value="">Select…</option>
                            {options.map((o) => (
                              <option key={o} value={o}>
                                {o.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <Input
                        label={label}
                        icon={Icon}
                        type={type}
                        value={form[key] || ''}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </MotionCard>

        {/* Generate plan */}
        <MotionCard delay={0.15} glow>
          <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[var(--text-main)] font-heading font-bold text-lg uppercase">Generate New Plan</p>
              <p className="text-muted text-sm mt-1">
                AI will create a personalised workout &amp; diet plan based on your profile.
              </p>
            </div>
            <Button onClick={handleGeneratePlan} loading={generating} className="shrink-0">
              Generate Plan
            </Button>
          </div>
        </MotionCard>
      </motion.div>
    </PageWrapper>
  );
}
