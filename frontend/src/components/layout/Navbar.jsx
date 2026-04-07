import { useState, useEffect, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import {
  Activity, LayoutDashboard, Utensils, Sparkles, Target,
  LogOut, Menu, X, Moon, Sun, ChevronDown,
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/',               label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/tracker',        label: 'Tracker',         icon: Utensils },
  { to: '/recommendations',label: 'Smart Fuel',      icon: Sparkles },
  { to: '/habits',         label: 'Habits',          icon: Target },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark]           = useState(() => document.documentElement.classList.contains('dark'));
  const [profileOpen, setProfileOpen] = useState(false);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl shadow-sm border-b border-surface-200/60 dark:border-white/8'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="NutriSmart AI home">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
                <Activity className="h-4.5 w-4.5 text-white" aria-hidden="true" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                Nutri<span className="gradient-text">Smart</span>
              </span>
            </Link>

            {/* ── Desktop Nav ── */}
            {user && (
              <div className="hidden md:flex items-center gap-1" role="list">
                {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    role="listitem"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-white/8 hover:text-slate-900 dark:hover:text-white'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </NavLink>
                ))}
              </div>
            )}

            {/* ── Right Controls ── */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDark}
                className="btn-ghost p-2 rounded-xl"
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {dark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>

              {user ? (
                <>
                  {/* Profile dropdown */}
                  <div className="relative hidden md:block">
                    <button
                      onClick={() => setProfileOpen(o => !o)}
                      className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-surface-100 dark:hover:bg-white/8 transition-colors"
                      aria-expanded={profileOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {initials}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">{user.name}</span>
                      <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 card p-1.5 shadow-xl"
                          role="menu"
                        >
                          <div className="px-3 py-2 border-b border-surface-100 dark:border-white/8 mb-1">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-danger-500 hover:bg-danger-500/8 transition-colors"
                            role="menuitem"
                          >
                            <LogOut className="h-4 w-4" aria-hidden="true" />
                            Sign out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Mobile hamburger */}
                  <button
                    className="md:hidden btn-ghost p-2 rounded-xl"
                    onClick={() => setMobileOpen(o => !o)}
                    aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileOpen}
                  >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
                  <Link to="/register" className="btn-primary text-sm">Get Started</Link>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileOpen && user && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t border-surface-200 dark:border-white/8 bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl"
            >
              <div className="px-4 py-3 space-y-1">
                {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-surface-100 dark:hover:bg-white/8'
                      }`
                    }
                  >
                    <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                    {label}
                  </NavLink>
                ))}
                <div className="pt-2 border-t border-surface-100 dark:border-white/8">
                  <div className="flex items-center gap-3 px-4 py-2 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger-500 hover:bg-danger-500/8 transition-colors"
                  >
                    <LogOut className="h-4.5 w-4.5" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Backdrop for profile dropdown */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} aria-hidden="true" />
      )}
    </>
  );
};

export default Navbar;
