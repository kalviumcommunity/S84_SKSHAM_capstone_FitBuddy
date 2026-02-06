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
  const { isAuthenticated, token, loading } = useSelector((s) => s.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
