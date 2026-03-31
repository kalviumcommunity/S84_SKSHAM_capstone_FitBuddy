import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Dumbbell,
  ShieldAlert
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/plan', label: 'Plan', icon: CalendarDays },
  { to: '/exercises', label: 'Exercises', icon: Dumbbell },
];

export default function MobileNav() {
  const { user } = useSelector((s) => s.auth);
  
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;
  const dynamicNavItems = [
    ...navItems,
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: ShieldAlert }] : [])
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-t border-surface-border pb-safe">
      <nav className="flex justify-around items-center p-2">
        {dynamicNavItems.map(({ to, label, icon: Icon }) => (
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
      </nav>
    </div>
  );
}
