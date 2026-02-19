import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, Dumbbell } from 'lucide-react';
import { Button } from '../components/ui';
import { updateProfile } from '../store/slices/profileSlice';
import { generatePlan } from '../store/slices/planSlice';
import { loadUser } from '../store/slices/authSlice';
import PageWrapper from '../components/layout/PageWrapper';
import {
  GOALS, ACTIVITY_LEVELS, WORKOUT_PREFERENCES,
  DIET_PREFERENCES, BODY_PARTS, EQUIPMENT, GENDERS, BUDGETS,
  COUNTRIES, MUSCLE_GROUPS, MEDICAL_CONDITIONS,
} from '../utils/constants';
import toast from 'react-hot-toast';

const TOTAL_STEPS = 5;

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

export default function Setup() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState({
    goal: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    country: '',
    activityLevel: '',
    workoutPreference: '',
    targetBodyParts: [],
    equipmentAvailable: [],
    strengthParts: [],
    weaknessParts: [],
    dietaryPreference: '',
    allergies: '',
    medicalConditions: [],
    customDescription: '',
    budget: 'medium',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading: profileLoading } = useSelector((s) => s.profile);
  const { generating } = useSelector((s) => s.plan);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    const profileData = {
      ...formData,
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
      allergies: formData.allergies ? formData.allergies.split(',').map((a) => a.trim()) : [],
      medicalConditions: formData.medicalConditions || [],
      customDescription: formData.customDescription?.trim() || '',
      strengthParts: formData.strengthParts || [],
      weaknessParts: formData.weaknessParts || [],
      country: formData.country || '',
    };

    const profileResult = await dispatch(updateProfile(profileData));
    if (updateProfile.fulfilled.match(profileResult)) {
      toast.success('Profile saved! Generating your plan...');
      // Refresh user data to get updated profileComplete flag
      await dispatch(loadUser());
      const planResult = await dispatch(generatePlan());
      if (generatePlan.fulfilled.match(planResult)) {
        toast.success('Your personalized plan is ready!');
        navigate('/dashboard');
      } else {
        toast.error('Plan generation failed. You can regenerate from dashboard.');
        navigate('/dashboard');
      }
    } else {
      toast.error('Failed to save profile');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!formData.goal;
      case 2: return formData.age && formData.gender && formData.height && formData.weight;
      case 3: return !!formData.activityLevel;
      case 4: return !!formData.workoutPreference;
      case 5: return !!formData.dietaryPreference;
      default: return false;
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  // Full-screen loading overlay while generating
  if (generating) {
    return (
      <PageWrapper>
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-6 max-w-md text-center px-6"
          >
            {/* Animated spinner */}
            <div className="relative w-24 h-24">
              <motion.div
                className="absolute inset-0 border-4 border-accent/20 rounded-full"
              />
              <motion.div
                className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-accent" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-[var(--text-main)] uppercase mb-2">
                Generating Your Plan
              </h2>
              <p className="text-muted text-sm">
                Our AI is crafting a personalized workout &amp; diet plan just for you. This may take a moment...
              </p>
            </div>

            {/* Animated progress dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-accent rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                />
              ))}
            </div>

            <div className="mt-4 space-y-2 w-full">
              {['Analyzing your profile...', 'Building workout routines...', 'Crafting diet plan...', 'Almost done...'].map((text, i) => (
                <motion.p
                  key={text}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 3, duration: 0.5 }}
                  className="text-xs text-dim text-center"
                >
                  {text}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-bg flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-surface-border">
          <div className="max-w-xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-[var(--text-main)]">Setup Profile</span>
            </div>
            <span className="text-sm font-medium text-muted">Step {step} of {TOTAL_STEPS}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-surface-light h-1">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Steps */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
              >
                {step === 1 && (
                  <StepGoal value={formData.goal} onChange={(v) => updateField('goal', v)} />
                )}
                {step === 2 && (
                  <StepBody formData={formData} updateField={updateField} />
                )}
                {step === 3 && (
                  <StepActivity value={formData.activityLevel} onChange={(v) => updateField('activityLevel', v)} />
                )}
                {step === 4 && (
                  <StepWorkout
                    formData={formData}
                    updateField={updateField}
                    toggleArrayField={toggleArrayField}
                  />
                )}
                {step === 5 && (
                  <StepDiet
                    formData={formData}
                    updateField={updateField}
                    toggleArrayField={toggleArrayField}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={step === 1}
                className="!text-surface-500"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>

              {step < TOTAL_STEPS ? (
                <Button onClick={nextStep} disabled={!canProceed()}>
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  loading={profileLoading}
                  disabled={!canProceed()}
                >
                  <Check className="w-4 h-4" /> Generate My Plan
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// --------------- Step Components ---------------

function StepGoal({ value, onChange }) {
  return (
    <div>
      <h2 className="text-3xl font-heading font-bold text-[var(--text-main)] mb-2">
        What's your goal?
      </h2>
      <p className="text-muted mb-8">Choose what best describes your fitness goal.</p>
      <div className="grid grid-cols-2 gap-4">
        {GOALS.map((goal) => (
          <SelectCard
            key={goal.value}
            selected={value === goal.value}
            onClick={() => onChange(goal.value)}
            icon={goal.icon}
            label={goal.label}
            description={goal.description}
          />
        ))}
      </div>
    </div>
  );
}

function StepBody({ formData, updateField }) {
  return (
    <div>
      <h2 className="text-3xl font-heading font-bold text-[var(--text-main)] mb-2">
        Your body stats
      </h2>
      <p className="text-muted mb-8">This helps us create the perfect AI plan for you.</p>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Age</label>
            <input
              type="number"
              className="input-field"
              placeholder="25"
              value={formData.age}
              onChange={(e) => updateField('age', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Gender</label>
            <select
              className="input-field"
              value={formData.gender}
              onChange={(e) => updateField('gender', e.target.value)}
            >
              <option value="">Select</option>
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Height (cm)</label>
            <input
              type="number"
              className="input-field"
              placeholder="175"
              value={formData.height}
              onChange={(e) => updateField('height', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted mb-1.5">Weight (kg)</label>
            <input
              type="number"
              className="input-field"
              placeholder="70"
              value={formData.weight}
              onChange={(e) => updateField('weight', e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted mb-1.5">Country</label>
          <select
            className="input-field"
            value={formData.country}
            onChange={(e) => updateField('country', e.target.value)}
          >
            <option value="">Select your country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function StepActivity({ value, onChange }) {
  return (
    <div>
      <h2 className="text-3xl font-heading font-bold text-[var(--text-main)] mb-2">
        Activity level?
      </h2>
      <p className="text-muted mb-8">How active are you on a typical week?</p>
      <div className="space-y-3">
        {ACTIVITY_LEVELS.map((level) => (
          <motion.button
            key={level.value}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onChange(level.value)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              value === level.value
                ? 'border-accent bg-accent/10'
                : 'border-surface-border hover:border-surface-hover'
            }`}
          >
            <p className={`font-semibold ${value === level.value ? 'text-accent' : 'text-[var(--text-main)]'}`}>
              {level.label}
            </p>
            <p className="text-sm text-muted mt-0.5">{level.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function StepWorkout({ formData, updateField, toggleArrayField }) {
  return (
    <div>
      <h2 className="text-3xl font-heading font-bold text-[var(--text-main)] mb-2">
        Workout preference
      </h2>
      <p className="text-muted mb-6">Where do you work out?</p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {WORKOUT_PREFERENCES.map((wp) => (
          <SelectCard
            key={wp.value}
            selected={formData.workoutPreference === wp.value}
            onClick={() => updateField('workoutPreference', wp.value)}
            icon={wp.icon}
            label={wp.label}
            small
          />
        ))}
      </div>

      <p className="text-sm font-semibold text-muted mb-3">Target body parts (optional)</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {BODY_PARTS.map((bp) => (
          <ChipButton
            key={bp}
            selected={formData.targetBodyParts.includes(bp)}
            onClick={() => toggleArrayField('targetBodyParts', bp)}
            label={bp}
          />
        ))}
      </div>

      <p className="text-sm font-semibold text-muted mb-3">💪 Your strong body parts (optional)</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {MUSCLE_GROUPS.map((mg) => (
          <ChipButton
            key={`str-${mg}`}
            selected={formData.strengthParts.includes(mg)}
            onClick={() => toggleArrayField('strengthParts', mg)}
            label={mg}
          />
        ))}
      </div>

      <p className="text-sm font-semibold text-muted mb-3">🎯 Weak parts to improve (optional)</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {MUSCLE_GROUPS.map((mg) => (
          <ChipButton
            key={`wk-${mg}`}
            selected={formData.weaknessParts.includes(mg)}
            onClick={() => toggleArrayField('weaknessParts', mg)}
            label={mg}
          />
        ))}
      </div>

      {formData.workoutPreference === 'home' && (
        <>
          <p className="text-sm font-semibold text-muted mb-3">Available equipment</p>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT.map((eq) => (
              <ChipButton
                key={eq}
                selected={formData.equipmentAvailable.includes(eq)}
                onClick={() => toggleArrayField('equipmentAvailable', eq)}
                label={eq}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function StepDiet({ formData, updateField, toggleArrayField }) {
  return (
    <div>
      <h2 className="text-3xl font-heading font-bold text-[var(--text-main)] mb-2">
        Diet & Health
      </h2>
      <p className="text-muted mb-6">Your dietary preferences and health information</p>

      <div className="grid grid-cols-2 gap-3 mb-8">
        {DIET_PREFERENCES.map((dp) => (
          <SelectCard
            key={dp.value}
            selected={formData.dietaryPreference === dp.value}
            onClick={() => updateField('dietaryPreference', dp.value)}
            icon={dp.icon}
            label={dp.label}
            small
          />
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-muted mb-2">
          Budget
        </label>
        <div className="grid grid-cols-3 gap-3">
          {BUDGETS.map((b) => (
            <SelectCard
              key={b.value}
              selected={formData.budget === b.value}
              onClick={() => updateField('budget', b.value)}
              label={b.label}
              description={b.description}
              small
            />
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-muted mb-1.5">
          Allergies (comma separated, optional)
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="e.g. peanuts, dairy"
          value={formData.allergies}
          onChange={(e) => updateField('allergies', e.target.value)}
        />
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold text-muted mb-3">🏥 Medical conditions (optional)</p>
        <p className="text-xs text-dim mb-3">
          Select any conditions so we can create a safe diet plan for you
        </p>
        <div className="flex flex-wrap gap-2">
          {MEDICAL_CONDITIONS.map((condition) => (
            <ChipButton
              key={condition}
              selected={formData.medicalConditions.includes(condition)}
              onClick={() => toggleArrayField('medicalConditions', condition)}
              label={condition}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-muted mb-1.5">
          📝 Custom workout description (optional)
        </label>
        <p className="text-xs text-dim mb-2">
          Describe any specific requirements, e.g. "I want to train legs 3 times a week" or mention any problems
        </p>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="e.g. I want to focus on legs 3x per week, I have knee pain sometimes..."
          value={formData.customDescription}
          onChange={(e) => updateField('customDescription', e.target.value)}
        />
      </div>
    </div>
  );
}

// --------------- Shared Sub-components ---------------

function SelectCard({ selected, onClick, icon, label, description, small }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
        small ? 'p-3' : 'p-5'
      } ${
        selected
          ? 'border-accent bg-accent/10'
          : 'border-surface-border hover:border-surface-hover'
      }`}
    >
      {icon && <span className="text-2xl mb-2 block">{icon}</span>}
      <p className={`font-semibold text-sm ${selected ? 'text-accent' : 'text-[var(--text-main)]'}`}>
        {label}
      </p>
      {description && (
        <p className="text-xs text-muted mt-1">{description}</p>
      )}
    </motion.button>
  );
}

function ChipButton({ selected, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        selected
          ? 'bg-accent text-white'
          : 'bg-surface-light text-muted hover:bg-surface-hover'
      }`}
    >
      {label}
    </button>
  );
}
