import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { Mail, Lock, Dumbbell, ArrowRight, Sun, Moon } from 'lucide-react';
import { login, googleAuth, clearError } from '../store/slices/authSlice';
import { Button, Input } from '../components/ui';
import PageWrapper from '../components/layout/PageWrapper';
import { useTheme } from '../context/ThemeContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const { theme, toggleTheme } = useTheme();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      const user = result.payload.user;
      navigate(user.profileComplete ? '/dashboard' : '/setup');
    }
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      const result = await dispatch(googleAuth({ token: response.access_token }));
      if (googleAuth.fulfilled.match(result)) {
        const user = result.payload.user;
        navigate(user.profileComplete ? '/dashboard' : '/setup');
      }
    },
    onError: () => {},
  });

  return (
    <PageWrapper>
      {/* Theme Toggle - Fixed Position */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-xl bg-surface border border-surface-border text-dim hover:text-[var(--text-main)] hover:bg-surface-light transition-all shadow-card"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="min-h-screen flex bg-bg">
        {/* Left — Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
          <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/6 rounded-full blur-[100px]" />
          <div className="relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow">
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-heading font-bold text-[var(--text-main)] mb-4 uppercase">
                Welcome Back
              </h2>
              <p className="text-muted text-lg max-w-sm mx-auto">
                Continue your fitness journey with AI-powered plans tailored just for you.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-[var(--text-main)] uppercase">FitBuddy</span>
            </div>

            <h1 className="text-3xl font-heading font-bold text-[var(--text-main)] mb-2 uppercase">
              Log In
            </h1>
            <p className="text-muted mb-8">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent hover:text-accent-hover font-semibold">
                Sign up
              </Link>
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                name="email"
                type="email"
                icon={Mail}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />

              <Button type="submit" fullWidth loading={loading}>
                Log In <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-bg px-4 text-dim">or continue with</span>
              </div>
            </div>

            <Button
              variant="secondary"
              fullWidth
              onClick={() => handleGoogle()}
              loading={loading}
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
