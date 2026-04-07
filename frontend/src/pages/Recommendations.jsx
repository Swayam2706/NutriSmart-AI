import { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import SkeletonCard from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';
import { Sparkles, ArrowRight, Utensils, Coffee, Sun, Moon, Zap } from 'lucide-react';

const TIME_TABS = [
  { value: 'breakfast', label: 'Breakfast', icon: Coffee },
  { value: 'lunch',     label: 'Lunch',     icon: Sun },
  { value: 'snack',     label: 'Snack',     icon: Utensils },
  { value: 'dinner',    label: 'Dinner',    icon: Moon },
];

const FOOD_EMOJI = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('chicken') || n.includes('meat')) return '🍗';
  if (n.includes('egg'))    return '🥚';
  if (n.includes('apple'))  return '🍎';
  if (n.includes('banana')) return '🍌';
  if (n.includes('rice'))   return '🍚';
  if (n.includes('salad'))  return '🥗';
  if (n.includes('oat'))    return '🥣';
  if (n.includes('milk') || n.includes('yogurt')) return '🥛';
  return '🍲';
};

const FoodCard = ({ food, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.4 }}
    className="card overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
  >
    {/* Image area */}
    <div className="h-36 bg-gradient-to-br from-primary-500/8 to-violet-500/8 dark:from-primary-500/12 dark:to-violet-500/12 flex items-center justify-center relative overflow-hidden">
      <span className="text-6xl group-hover:scale-110 transition-transform duration-500" role="img" aria-label={food.name}>
        {FOOD_EMOJI(food.name)}
      </span>
      <div className="absolute top-3 right-3">
        <span className="badge bg-white/90 dark:bg-surface-900/90 text-primary-500 shadow-sm backdrop-blur-sm border border-primary-500/20">
          <Sparkles className="h-3 w-3" aria-hidden="true" /> Match
        </span>
      </div>
      {food.diet === 'veg' && (
        <div className="absolute top-3 left-3">
          <span className="badge bg-accent-500/10 text-accent-600 border border-accent-500/20">🌱 Veg</span>
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-5 flex-1 flex flex-col">
      <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 leading-tight">{food.name}</h3>
      <p className="text-2xl font-extrabold text-primary-500 mb-4">
        {food.calories} <span className="text-sm font-medium text-slate-400">kcal</span>
      </p>

      {/* Protein bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Protein</span>
          <span className="font-bold text-slate-700 dark:text-slate-300">{food.protein}g</span>
        </div>
        <div className="w-full h-1.5 bg-surface-100 dark:bg-white/8 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(food.protein * 2, 100)}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
          />
        </div>
      </div>

      {/* Macros grid */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <div className="bg-surface-50 dark:bg-white/4 rounded-xl p-3 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Carbs</p>
          <p className="font-bold text-slate-900 dark:text-white">{food.carbs}g</p>
        </div>
        <div className="bg-surface-50 dark:bg-white/4 rounded-xl p-3 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Fat</p>
          <p className="font-bold text-slate-900 dark:text-white">{food.fat}g</p>
        </div>
      </div>

      <Link
        to="/tracker"
        className="btn-primary w-full mt-auto justify-center py-2.5 rounded-xl text-sm"
        aria-label={`Add ${food.name} to tracker`}
      >
        Add to Tracker <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  </motion.article>
);

const Recommendations = () => {
  const { user } = useContext(AuthContext);
  const [recs, setRecs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('lunch');

  const fetchRecs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/foods/recommendations?timeOfDay=${timeOfDay}`);
      setRecs(res.data);
    } catch {
      setRecs([]);
    } finally {
      setLoading(false);
    }
  }, [timeOfDay]);

  useEffect(() => { fetchRecs(); }, [fetchRecs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── Hero banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl bg-gradient-to-br from-surface-900 to-surface-800 dark:from-surface-950 dark:to-surface-900 p-8 overflow-hidden border border-white/8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.2),transparent)] pointer-events-none" aria-hidden="true" />
        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full bg-primary-500/10 blur-2xl pointer-events-none" aria-hidden="true" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/15 border border-primary-500/25 text-primary-400 text-xs font-bold mb-4">
              <Zap className="h-3.5 w-3.5" aria-hidden="true" /> AI POWERED
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Smart Fuel</h1>
            <p className="text-slate-400 max-w-md">
              Personalized for your{' '}
              <span className="text-primary-400 font-semibold">{user?.diet === 'veg' ? 'vegetarian' : 'non-vegetarian'}</span>{' '}
              diet, optimized to{' '}
              <span className="text-primary-400 font-semibold">{user?.goal}</span> weight.
            </p>
          </div>

          {/* Time tabs */}
          <div className="flex bg-white/5 border border-white/8 rounded-2xl p-1.5 gap-1 flex-wrap" role="tablist" aria-label="Meal time filter">
            {TIME_TABS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                role="tab"
                aria-selected={timeOfDay === value}
                onClick={() => setTimeOfDay(value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  timeOfDay === value
                    ? 'bg-gradient-to-r from-primary-500 to-violet-600 text-white shadow-lg shadow-primary-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/8'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Section heading ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
          <Utensils className="h-5 w-5 text-primary-500" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Top Picks for {TIME_TABS.find(t => t.value === timeOfDay)?.label}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Matched to your profile</p>
        </div>
      </div>

      {/* ── Cards ── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={4} className="h-80" />)}
          </motion.div>
        ) : recs.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card">
            <EmptyState
              icon={Sparkles}
              title="No recommendations found"
              description="We couldn't find foods matching your profile for this meal time. Try seeding the food database or switching meal time."
            />
          </motion.div>
        ) : (
          <motion.div key="cards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recs.map((food, i) => <FoodCard key={food._id} food={food} index={i} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Recommendations;
