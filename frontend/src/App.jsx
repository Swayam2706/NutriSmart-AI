import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Toast from './components/ui/Toast';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import Recommendations from './pages/Recommendations';
import Habits from './pages/Habits';

/* Page transition wrapper */
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.25, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

/* Inner app with location-aware transitions */
const AppRoutes = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname) && !localStorage.getItem('token');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
            <Route path="/tracker" element={<ProtectedRoute><PageTransition><Tracker /></PageTransition></ProtectedRoute>} />
            <Route path="/recommendations" element={<ProtectedRoute><PageTransition><Recommendations /></PageTransition></ProtectedRoute>} />
            <Route path="/habits" element={<ProtectedRoute><PageTransition><Habits /></PageTransition></ProtectedRoute>} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  /* Respect system dark mode preference */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    if (mq.matches) document.documentElement.classList.add('dark');
    const handler = (e) => document.documentElement.classList.toggle('dark', e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Toast />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
