import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  LogOut,
  Dumbbell,
  Sun,
  Moon,
  Bug,
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../context/ThemeContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/plan', label: 'My Plan', icon: CalendarDays },
];

export default function Sidebar({ onFeedbackClick }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="hidden md:flex fixed left-0 top-0 h-screen w-[72px] z-40
        flex-col items-center py-6 gap-2
        bg-surface/70 backdrop-blur-xl border-r border-surface-border text-[var(--text-main)]"
    >
      {/* Logo */}
      <Link
        to="/"
        title="Go Home"
        className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center mb-6 shadow-glow shrink-0 hover:bg-accent-hover transition-all duration-200"
      >
        <Dumbbell className="w-5 h-5 text-white" />
      </Link>

      {/* Nav */}
      <nav className="flex-1 flex flex-col items-center gap-1 w-full px-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 group ${
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-dim hover:text-[var(--text-main)] hover:bg-surface-light/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -left-[10px] top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-accent"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5" />
                {/* Tooltip */}
                <span className="absolute left-full ml-3 px-2.5 py-1 bg-surface border border-surface-border rounded-lg text-xs font-medium text-[var(--text-main)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-glass z-50">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-3 pt-4 border-t border-surface-border w-full">
        {/* Bug Report */}
        <button
          onClick={onFeedbackClick}
          title="Report a Bug / Suggest Feature"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-dim hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-200"
        >
          <Bug className="w-5 h-5" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-dim hover:text-[var(--text-main)] hover:bg-surface-light/50 transition-all duration-200"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Avatar → Profile link */}
        <NavLink
          to="/profile"
          title={`${user?.name || 'Profile'} — View Profile`}
          className={({ isActive }) =>
            `relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ring-2 ${
              isActive
                ? 'ring-accent bg-accent/15'
                : 'ring-transparent bg-accent/10 hover:ring-accent/40'
            }`
          }
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-accent">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          )}
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="w-11 h-11 rounded-xl flex items-center justify-center text-dim hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </motion.aside>
  );
}
