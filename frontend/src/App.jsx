import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { loadUser } from './store/slices/authSlice';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import Plan from './pages/Plan';
import Profile from './pages/Profile';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

function ProtectedRoute({ children }) {
  const { isAuthenticated, token, loading, user } = useSelector((s) => s.auth);

  // Show loading state while checking authentication
  if (loading || (!token && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  // Not authenticated - redirect to login
  if (!token || !isAuthenticated) return <Navigate to="/login" replace />;
  
  // Redirect to setup if profile not complete (except if already on /setup)
  if (user && !user.profileComplete && window.location.pathname !== '/setup') {
    return <Navigate to="/setup" replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, token } = useSelector((s) => s.auth);
  if (token && isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch, token]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'font-body',
          style: {
            background: '#18181b',
            color: '#ffffff',
            border: '1px solid #27272a',
            borderRadius: '12px',
            padding: '12px 16px',
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Setup (protected but no sidebar) */}
          <Route path="/setup" element={<ProtectedRoute><Setup /></ProtectedRoute>} />

          {/* Dashboard (protected with sidebar) */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback - 404 Page */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-bg">
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-accent">404</h1>
                <p className="text-lg text-muted">Page not found</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="mt-6 px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          } />
        </Routes>
      </AnimatePresence>
    </>
  );
}
