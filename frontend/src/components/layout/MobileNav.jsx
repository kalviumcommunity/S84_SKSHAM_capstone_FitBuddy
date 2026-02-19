import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/plan', label: 'Plan', icon: CalendarDays },
];

export default function MobileNav() {
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-t border-surface-border pb-safe">
      <nav className="flex justify-around items-center p-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                isActive ? 'text-accent' : 'text-dim hover:text-[var(--text-main)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-glow"
                      className="absolute inset-0 bg-accent/20 blur-lg rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Profile avatar tab */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
              isActive ? 'text-accent' : 'text-dim hover:text-[var(--text-main)]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                {user?.avatar ? (
                  <img src={user.avatar} alt="" className={`w-6 h-6 rounded-full object-cover ring-1 ${isActive ? 'ring-accent' : 'ring-transparent'}`} />
                ) : (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? 'bg-accent text-white' : 'bg-accent/15 text-accent'}`}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-glow"
                    className="absolute inset-0 bg-accent/20 blur-lg rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider">Profile</span>
            </>
          )}
        </NavLink>
      </nav>
    </div>
  );
}
