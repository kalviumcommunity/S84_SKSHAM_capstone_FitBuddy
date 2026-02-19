import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Shield, Edit3, Save, X, RefreshCw,
  Ruler, Weight, Target, Activity, Flame, Camera, MapPin,
  Dumbbell, Heart, Globe, Wallet, AlertCircle,
} from 'lucide-react';
import { MotionCard, Button, Input, Badge, Skeleton } from '../components/ui';
import PageWrapper from '../components/layout/PageWrapper';
import { fetchProfile, updateProfile } from '../store/slices/profileSlice';
import { generatePlan } from '../store/slices/planSlice';
import { uploadAvatar } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
};

const FIELD_META = [
  { key: 'age', label: 'Age', icon: User, type: 'number', section: 'body' },
  { key: 'gender', label: 'Gender', icon: User, type: 'select', options: ['male', 'female', 'other'], section: 'body' },
  { key: 'height', label: 'Height (cm)', icon: Ruler, type: 'number', section: 'body' },
  { key: 'weight', label: 'Weight (kg)', icon: Weight, type: 'number', section: 'body' },
  { key: 'country', label: 'Country', icon: Globe, type: 'text', section: 'body' },
  { key: 'goal', label: 'Goal', icon: Target, type: 'select', options: ['cut', 'bulk', 'maintain', 'strength'], section: 'fitness' },
  { key: 'activityLevel', label: 'Activity Level', icon: Flame, type: 'select', options: ['sedentary', 'light', 'moderate', 'active', 'very_active'], section: 'fitness' },
  { key: 'workoutPreference', label: 'Workout Preference', icon: Dumbbell, type: 'select', options: ['gym', 'home', 'outdoor', 'yoga', 'mixed'], section: 'fitness' },
  { key: 'dietaryPreference', label: 'Dietary Preference', icon: Heart, type: 'select', options: ['anything', 'vegetarian', 'vegan', 'keto', 'paleo'], section: 'diet' },
  { key: 'budget', label: 'Budget', icon: Wallet, type: 'select', options: ['low', 'medium', 'high'], section: 'diet' },
];

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useSelector((s) => s.auth);
  const { profile, loading } = useSelector((s) => s.profile);
  const { generating } = useSelector((s) => s.plan);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Keep form in sync with profile whenever profile loads/refreshes
  useEffect(() => {
    if (profile && !editing) setForm({ ...profile });
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const result = await dispatch(updateProfile(form));
    setSaving(false);
    if (updateProfile.fulfilled.match(result)) {
      setEditing(false);
      await dispatch(fetchProfile());
      toast.success('Profile saved! Regenerating your plan…');
      setRegenerating(true);
      const planResult = await dispatch(generatePlan());
      setRegenerating(false);
      if (generatePlan.fulfilled.match(planResult)) {
        toast.success('🎉 Your new plan is ready!');
      } else {
        toast.error('Plan regeneration failed — try again from Setup.');
      }
    } else {
      toast.error('Failed to update profile');
    }
  };

  const handleGeneratePlan = () => navigate('/setup');
  const handleChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await dispatch(uploadAvatar(reader.result)).unwrap();
        toast.success('Profile picture updated!');
      } catch (err) {
        toast.error(err || 'Upload failed');
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-6">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-48" />
          <Skeleton className="h-80" />
        </div>
      </PageWrapper>
    );
  }

  const bodyFields = FIELD_META.filter((f) => f.section === 'body');
  const fitnessFields = FIELD_META.filter((f) => f.section === 'fitness');
  const dietFields = FIELD_META.filter((f) => f.section === 'diet');

  const renderField = ({ key, label, icon: Icon, type, options }) => {
    if (!editing) {
      return (
        <motion.div key={key} variants={scaleIn} className="bg-surface-light/30 rounded-xl p-4 hover:bg-surface-light/50 transition-colors duration-200">
          <div className="flex items-center gap-2 text-dim mb-1">
            <Icon className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
          </div>
          <p className="text-[var(--text-main)] font-semibold capitalize">
            {profile?.[key] != null ? String(profile[key]).replace(/_/g, ' ') : <span className="text-dim">—</span>}
          </p>
        </motion.div>
      );
    }

    return (
      <motion.div key={key} variants={scaleIn}>
        {type === 'select' ? (
          <div>
            <label className="block text-xs text-muted uppercase tracking-wider font-semibold mb-2">{label}</label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dim pointer-events-none" />
              <select
                value={form[key] ?? ''}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full bg-surface border border-surface-border rounded-xl pl-10 pr-4 py-3 text-[var(--text-main)] text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent appearance-none transition-all duration-200"
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
            value={form[key] ?? ''}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        )}
      </motion.div>
    );
  };

  return (
    <PageWrapper>
      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8 max-w-3xl">
        {/* Header */}
        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-[var(--text-main)] uppercase">Profile</h1>
            <p className="text-muted mt-1">Account &amp; fitness settings</p>
          </div>
          {!editing ? (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Edit3 className="w-4 h-4" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setForm(profile); }}>
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
                <Save className="w-4 h-4" /> Save
              </Button>
            </div>
          )}
        </motion.div>

        {/* Account card with avatar */}
        <MotionCard delay={0.05}>
          <p className="text-xs font-bold text-dim uppercase tracking-widest mb-5">Account</p>
          <div className="flex items-center gap-5">
            {/* Avatar with upload */}
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 rounded-2xl overflow-hidden bg-accent/10 flex items-center justify-center cursor-pointer border-2 border-transparent group-hover:border-accent/40 transition-all duration-200"
                onClick={handleAvatarClick}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-accent" />
                )}
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded-2xl">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFile}
                className="hidden"
              />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-xl font-heading font-bold text-[var(--text-main)]">{user?.name || 'Athlete'}</p>
              <p className="text-muted text-sm flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {user?.authProvider && (
                  <Badge variant="default">
                    <Shield className="w-3 h-3" /> {user.authProvider}
                  </Badge>
                )}
                {profile?.country && (
                  <Badge variant="default">
                    <MapPin className="w-3 h-3" /> {profile.country}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </MotionCard>

        {/* Body Metrics */}
        <MotionCard delay={0.1}>
          <p className="text-xs font-bold text-dim uppercase tracking-widest mb-5">Body Metrics</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={editing ? 'edit-body' : 'view-body'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={editing ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'grid grid-cols-2 md:grid-cols-3 gap-4'}
            >
              {bodyFields.map(renderField)}
            </motion.div>
          </AnimatePresence>
        </MotionCard>

        {/* Fitness Settings */}
        <MotionCard delay={0.15}>
          <p className="text-xs font-bold text-dim uppercase tracking-widest mb-5">Fitness Settings</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={editing ? 'edit-fitness' : 'view-fitness'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={editing ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'grid grid-cols-2 md:grid-cols-3 gap-4'}
            >
              {fitnessFields.map(renderField)}
            </motion.div>
          </AnimatePresence>

          {/* Display strength & weakness as chips */}
          {!editing && (profile?.strengthParts?.length > 0 || profile?.weaknessParts?.length > 0) && (
            <div className="mt-5 pt-5 border-t border-surface-border space-y-3">
              {profile?.strengthParts?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-2">Strong Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.strengthParts.map((p) => (
                      <span key={p} className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-semibold">{p}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile?.weaknessParts?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-2">Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.weaknessParts.map((p) => (
                      <span key={p} className="px-3 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs font-semibold">{p}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </MotionCard>

        {/* Diet Preferences */}
        <MotionCard delay={0.2}>
          <p className="text-xs font-bold text-dim uppercase tracking-widest mb-5">Diet Preferences</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={editing ? 'edit-diet' : 'view-diet'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={editing ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'grid grid-cols-2 md:grid-cols-3 gap-4'}
            >
              {dietFields.map(renderField)}
            </motion.div>
          </AnimatePresence>

          {/* Allergies */}
          {!editing && profile?.allergies?.length > 0 && (
            <div className="mt-5 pt-5 border-t border-surface-border">
              <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Allergies
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((a) => (
                  <span key={a} className="px-3 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-semibold">{a}</span>
                ))}
              </div>
            </div>
          )}
        </MotionCard>

        {/* Generate plan */}
        <MotionCard delay={0.25} glow>
          <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
            <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center shrink-0">
              <RefreshCw className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[var(--text-main)] font-heading font-bold text-lg uppercase">Generate New Plan</p>
              <p className="text-muted text-sm mt-1">
                Update your goals &amp; preferences to generate a fresh AI workout and diet plan.
              </p>
            </div>
            <Button onClick={handleGeneratePlan} className="shrink-0">
              <RefreshCw className="w-4 h-4" /> Setup &amp; Generate
            </Button>
          </div>
        </MotionCard>
      </motion.div>
    </PageWrapper>
  );
}
