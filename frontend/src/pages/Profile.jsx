import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Shield, Edit3, Save, X, RefreshCw,
  Ruler, Weight, Target, Flame, Camera, MapPin,
  Dumbbell, Heart, Globe, Wallet, AlertCircle,
} from 'lucide-react';
import { MotionCard, Button, Badge, Skeleton } from '../components/ui';
import PageWrapper from '../components/layout/PageWrapper';
import { fetchProfile, updateProfile } from '../store/slices/profileSlice';
import { generatePlan } from '../store/slices/planSlice';
import { uploadAvatar } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user } = useSelector((s) => s.auth);
  const { profile, loading } = useSelector((s) => s.profile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({ ...profile });
    }
  }, [profile]);

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setForm({ ...profile });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await dispatch(updateProfile(form));
      if (updateProfile.fulfilled.match(result)) {
        setEditing(false);
        await dispatch(fetchProfile());
        toast.success('Profile saved! Regenerating your plan…');
        
        const planResult = await dispatch(generatePlan());
        if (generatePlan.fulfilled.match(planResult)) {
          toast.success('🎉 Your new plan is ready!');
        } else {
          toast.error('Plan regeneration failed — try again from Setup.');
        }
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      toast.error('Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
      } finally {
        setUploading(false);
      }
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

  return (
    <PageWrapper>
      <div className="space-y-8 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-[var(--text-main)] uppercase">Profile</h1>
            <p className="text-muted mt-1">Account &amp; fitness settings</p>
          </div>
          {!editing ? (
            <Button variant="outline" size="sm" onClick={handleEditClick}>
              <Edit3 className="w-4 h-4" /> Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
                <Save className="w-4 h-4" /> Save
              </Button>
            </div>
          )}
        </div>

        {/* Account Card */}
        <MotionCard delay={0.05}>
          <p className="text-xs font-bold text-dim uppercase tracking-widest mb-5">Account</p>
          <div className="flex items-center gap-5">
            {/* Avatar */}
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
          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Age</label>
                <input
                  type="number"
                  value={form.age || ''}
                  onChange={(e) => handleChange('age', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-[var(--text-main)]"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Gender</label>
                <select
                  value={form.gender || ''}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-[var(--text-main)] appearance-none"
                >
                  <option value="">Select…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Height */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={form.height || ''}
                  onChange={(e) => handleChange('height', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-[var(--text-main)]"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={form.weight || ''}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-[var(--text-main)]"
                />
              </div>

              {/* Country */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Country</label>
                <input
                  type="text"
                  value={form.country || ''}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-[var(--text-main)]"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* View Mode */}
              <div className="bg-surface-light/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-1">Age</p>
                <p className="text-[var(--text-main)] font-semibold">{profile?.age || '—'}</p>
              </div>
              <div className="bg-surface-light/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-1">Gender</p>
                <p className="text-[var(--text-main)] font-semibold capitalize">{profile?.gender?.replace(/_/g, ' ') || '—'}</p>
              </div>
              <div className="bg-surface-light/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-1">Height</p>
                <p className="text-[var(--text-main)] font-semibold">{profile?.height ? `${profile.height} cm` : '—'}</p>
              </div>
              <div className="bg-surface-light/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-1">Weight</p>
                <p className="text-[var(--text-main)] font-semibold">{profile?.weight ? `${profile.weight} kg` : '—'}</p>
              </div>
              <div className="bg-surface-light/30 rounded-xl p-4 md:col-span-2">
                <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-1">Country</p>
                <p className="text-[var(--text-main)] font-semibold">{profile?.country || '—'}</p>
              </div>
            </div>
          )}
        </MotionCard>

        {/* Fitness Settings */}
        <MotionCard delay={0.15}>
          <p className="text-xs font-bold text-dim uppercase tracking-widest mb-5">Fitness Settings</p>
          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Goal */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Goal</label>
                <select
                  value={form.goal || ''}
                  onChange={(e) => handleChange('goal', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-[var(--text-main)] appearance-none"
                >
                  <option value="">Select…</option>
                  <option value="cut">Cut</option>
                  <option value="bulk">Bulk</option>
                  <option value="maintain">Maintain</option>
                  <option value="strength">Strength</option>
                </select>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Activity Level</label>
                <select
                  value={form.activityLevel || ''}
                  onChange={(e) => handleChange('activityLevel', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-[var(--text-main)] appearance-none"
                >
                  <option value="">Select…</option>
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="athlete">Athlete</option>
                </select>
              </div>

              {/* Workout Preference */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Workout Preference</label>
                <select
                  value={form.workoutPreference || ''}
                  onChange={(e) => handleChange('workoutPreference', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-[var(--text-main)] appearance-none"
                >
                  <option value="">Select…</option>
                  <option value="gym">Gym</option>
                  <option value="home">Home</option>
                  <option value="calisthenics">Calisthenics</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* View Mode */}
              <div className="bg-surface-light/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-1">Goal</p>
                <p className="text-[var(--text-main)] font-semibold capitalize">{profile?.goal?.replace(/_/g, ' ') || '—'}</p>
              </div>
              <div className="bg-surface-light/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-1">Activity</p>
                <p className="text-[var(--text-main)] font-semibold capitalize">{profile?.activityLevel?.replace(/_/g, ' ') || '—'}</p>
              </div>
              <div className="bg-surface-light/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-1">Workout</p>
                <p className="text-[var(--text-main)] font-semibold capitalize">{profile?.workoutPreference?.replace(/_/g, ' ') || '—'}</p>
              </div>

              {profile?.strengthParts?.length > 0 && (
                <div className="bg-surface-light/30 rounded-xl p-4 md:col-span-2">
                  <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-2">Strong Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.strengthParts.map((p) => (
                      <span key={p} className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-semibold">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {profile?.weaknessParts?.length > 0 && (
                <div className="bg-surface-light/30 rounded-xl p-4 md:col-span-2">
                  <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-2">Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.weaknessParts.map((p) => (
                      <span key={p} className="px-2 py-1 rounded-lg bg-red-500/15 text-red-400 text-xs font-semibold">{p}</span>
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
          {editing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Dietary Preference */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Dietary Preference</label>
                <select
                  value={form.dietaryPreference || ''}
                  onChange={(e) => handleChange('dietaryPreference', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-[var(--text-main)] appearance-none"
                >
                  <option value="">Select…</option>
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Budget</label>
                <select
                  value={form.budget || ''}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-surface-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-[var(--text-main)] appearance-none"
                >
                  <option value="">Select…</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* View Mode */}
              <div className="bg-surface-light/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-1">Diet</p>
                <p className="text-[var(--text-main)] font-semibold capitalize">
                  {form.dietaryPreference === 'veg' ? 'Vegetarian' : form.dietaryPreference === 'non-veg' ? 'Non-Veg' : form.dietaryPreference?.replace(/_/g, ' ') || '—'}
                </p>
              </div>
              <div className="bg-surface-light/30 rounded-xl p-4">
                <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-1">Budget</p>
                <p className="text-[var(--text-main)] font-semibold capitalize">{profile?.budget?.replace(/_/g, ' ') || '—'}</p>
              </div>

              {profile?.allergies?.length > 0 && (
                <div className="bg-surface-light/30 rounded-xl p-4 md:col-span-2">
                  <p className="text-xs font-semibold text-dim uppercase tracking-wider mb-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Allergies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((a) => (
                      <span key={a} className="px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-xs font-semibold">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </MotionCard>

        {/* Generate Plan */}
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
            <Button onClick={() => navigate('/setup')} className="shrink-0">
              <RefreshCw className="w-4 h-4" /> Setup &amp; Generate
            </Button>
          </div>
        </MotionCard>
      </div>
    </PageWrapper>
  );
}
