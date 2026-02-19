import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, Sun, Moon, Dumbbell, Bug } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../context/ThemeContext';
import FeedbackModal from '../FeedbackModal';
import ChatWidget from '../ChatWidget';

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Simple title mapping
  const getTitle = () => {
    switch(location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/plan': return 'My Plan';
      case '/profile': return 'Profile';
      default: return 'FitBuddy';
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-bg transition-colors duration-300">
      <Sidebar onFeedbackClick={() => setFeedbackOpen(true)} />
      <main className="flex-1 ml-0 md:ml-[72px] pb-24 md:pb-10"> {/* Added bottom padding for mobile nav */}
        
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-bg/80 backdrop-blur-md border-b border-surface-border">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shrink-0">
               <Dumbbell className="w-4 h-4 text-white" />
             </div>
             <span className="font-heading font-bold text-lg text-[var(--text-main)] uppercase tracking-wide">
               {getTitle()}
             </span>
          </div>
          <div className="flex items-center gap-2">
            <button
               onClick={() => setFeedbackOpen(true)}
               className="p-2 rounded-lg text-dim hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
               title="Report Bug / Suggest Feature"
            >
              <Bug className="w-5 h-5" />
            </button>
            <button
               onClick={toggleTheme}
               className="p-2 rounded-lg text-dim hover:bg-surface-light/50 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
               onClick={handleLogout}
               className="p-2 rounded-lg text-dim hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
          <Outlet />
        </div>
      </main>
      <MobileNav />

      {/* Feedback Modal */}
      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      {/* AI Coach Chatbot */}
      <ChatWidget />
    </div>
  );
}
