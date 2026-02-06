import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Zap, Target, TrendingUp, ArrowRight, ChevronRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const features = [
  {
    icon: Zap,
    title: 'AI Workout Plans',
    desc: 'Personalised programmes built by AI, adapted to your body, goals, and equipment.',
  },
  {
    icon: Target,
    title: 'Macro Tracking',
    desc: 'Hit your protein, carbs, and fat targets with a meal plan generated in seconds.',
  },
  {
    icon: TrendingUp,
    title: 'Daily Progress',
    desc: 'Check off exercises and meals, track water intake, and watch your streak grow.',
  },
];

export default function Landing() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg text-[var(--text-main)] overflow-hidden transition-colors duration-300">

      {/* ── Navbar ─────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 mt-4 px-4 sm:px-6 rounded-2xl bg-surface/80 backdrop-blur-xl border border-surface-border">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-glow">
                <Dumbbell className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="text-lg font-heading font-bold uppercase tracking-wider text-[var(--text-main)]">FitBuddy</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-dim hover:text-[var(--text-main)] hover:bg-surface-light/50 transition-all"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <Link
                to="/login"
                className="text-sm font-medium text-dim hover:text-[var(--text-main)] transition-colors px-2 sm:px-4 py-2"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-accent hover:bg-accent-hover text-white font-semibold text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-glow hover:shadow-glow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative pt-40 pb-28 px-6">
        {/* Red glow blob */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/8 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" /> AI-Powered Fitness
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold leading-[0.95] tracking-tight mb-6 text-[var(--text-main)]"
          >
            Train Smarter.
            <br />
            <span className="text-gradient">Get Stronger.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            FitBuddy generates a fully personalised workout and diet plan
            in under 60 seconds — tailored to your body, goals, and lifestyle.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="bg-accent hover:bg-accent-hover text-white font-semibold text-base px-8 py-4 rounded-xl inline-flex items-center gap-2 shadow-glow hover:shadow-glow-lg transition-all"
            >
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="bg-surface-light hover:bg-surface-hover text-[var(--text-main)] font-semibold text-base px-8 py-4 rounded-xl inline-flex items-center gap-2 transition-all"
            >
              Log In
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features ──────────────────────────────── */}
      <section className="py-24 px-6">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4 text-[var(--text-main)]">
              Everything You Need to <span className="text-gradient">Dominate</span>
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              No guesswork. No cookie-cutter plans. Just results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                className="bg-surface border border-surface-border rounded-2xl p-8 group hover:border-accent/20 transition-colors duration-200"
              >
                <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-glow transition-shadow duration-300">
                  <f.icon className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-heading font-bold text-[var(--text-main)] mb-3 uppercase tracking-wide">
                  {f.title}
                </h3>
                <p className="text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Stats Bar ─────────────────────────────── */}
      <section className="py-16 px-6 border-y border-surface-border">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { val: '10K+', label: 'Active Users' },
            { val: '50K+', label: 'Plans Generated' },
            { val: '4.9', label: 'App Rating' },
            { val: '97%', label: 'Goal Hit Rate' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-heading font-bold text-white">{s.val}</p>
              <p className="text-sm text-muted mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────── */}
      <section className="py-28 px-6 relative">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-2xl mx-auto text-center"
        >
          <h2 className="text-4xl sm:text-5xl font-heading font-bold mb-6">
            Ready to <span className="text-gradient">Transform</span>?
          </h2>
          <p className="text-muted text-lg mb-10">
            Join thousands of athletes who ditched the generic plans.
          </p>
          <Link
            to="/signup"
            className="btn-primary text-lg px-10 py-4 rounded-xl inline-flex items-center gap-2 shadow-glow"
          >
            Get Your Plan <ChevronRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="border-t border-surface-border py-10 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-accent" />
            <span className="text-sm font-heading font-bold text-white uppercase tracking-wider">FitBuddy</span>
          </div>
          <p className="text-xs text-dim">&copy; {new Date().getFullYear()} FitBuddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
