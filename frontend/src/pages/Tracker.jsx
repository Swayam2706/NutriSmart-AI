import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { Plus, Trash2, Search, Coffee, Sun, Moon, Utensils, X, ChevronDown } from 'lucide-react';

const TIME_OPTIONS = [
  { value: 'breakfast', label: 'Breakfast', icon: Coffee,   color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  { value: 'lunch',     label: 'Lunch',     icon: Sun,      color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  { value: 'snack',     label: 'Snack',     icon: Utensils, color: 'bg-pink-500/10 text-pink-600 border-pink-500/20' },
  { value: 'dinner',    label: 'Dinner',    icon: Moon,     color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
];

const MealBadge = ({ timeOfDay }) => {
  const opt = TIME_OPTIONS.find(t => t.value === timeOfDay);
  if (!opt) return null;
  const Icon = opt.icon;
  return (
    <span className={`badge border ${opt.color}`}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {opt.label}
    </span>
  );
};

const Tracker = () => {
  const [stats, setStats]           = useState(null);
  const [foods, setFoods]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalOpen, setModalOpen]   = useState(false);
  const [search, setSearch]         = useState('');
  const [timeOfDay, setTimeOfDay]   = useState('lunch');
  const [deleting, setDeleting]     = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      const [trackerRes, foodsRes] = await Promise.all([
        api.get('/tracker/today'),
        api.get('/foods'),
      ]);
      setStats(trackerRes.data);
      setFoods(foodsRes.data);
    } catch {
      toast.error('Failed to load tracker data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAddMeal = async (food) => {
    try {
      const res = await api.post('/tracker/add', { name: food.name, calories: food.calories, timeOfDay });
      setStats(res.data);
      setModalOpen(false);
      setSearch('');
      toast.success(`${food.name} added!`);
    } catch {
      toast.error('Failed to add meal');
    }
  };

  const handleDelete = async (mealId, mealName) => {
    setDeleting(mealId);
    try {
      const res = await api.delete(`/tracker/meal/${mealId}`);
      setStats(res.data);
      toast.success(`${mealName} removed`);
    } catch {
      toast.error('Failed to remove meal');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const consumed = stats?.totalCaloriesCons || 0;
  const goal     = stats?.dailyGoal || 2000;
  const pct      = Math.min((consumed / goal) * 100, 100);

  if (loading) return <Spinner label="Loading tracker…" />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Daily Tracker</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Log your meals and stay on target</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary self-start sm:self-auto">
          <Plus className="h-4.5 w-4.5" aria-hidden="true" /> Add Meal
        </button>
      </motion.div>

      {/* ── Summary card ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Today's Summary</h2>
          <span className={`badge ${pct >= 100 ? 'bg-danger-500/10 text-danger-500' : 'bg-accent-500/10 text-accent-500'}`}>
            {pct >= 100 ? 'Goal reached!' : `${Math.round(pct)}% of goal`}
          </span>
        </div>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{consumed}</p>
            <p className="text-sm text-slate-500 mt-0.5">kcal consumed</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">{goal}</p>
            <p className="text-sm text-slate-500 mt-0.5">kcal goal</p>
          </div>
        </div>
        <div className="w-full h-3 bg-surface-100 dark:bg-white/8 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Daily calorie progress">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${pct >= 100 ? 'bg-gradient-to-r from-danger-400 to-danger-500' : 'bg-gradient-to-r from-primary-500 to-violet-500'}`}
          />
        </div>
        <p className="text-right text-xs font-semibold mt-1.5 text-slate-500">
          {stats?.remainingCalories > 0 ? `${stats.remainingCalories} kcal remaining` : 'Daily goal exceeded'}
        </p>
      </motion.div>

      {/* ── Meals list ── */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Today's Meals</h2>
        {!stats?.meals?.length ? (
          <div className="card">
            <EmptyState
              icon={Utensils}
              title="No meals logged yet"
              description="Start tracking your nutrition by adding your first meal of the day."
              action={
                <button onClick={() => setModalOpen(true)} className="btn-primary">
                  <Plus className="h-4 w-4" aria-hidden="true" /> Log first meal
                </button>
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {stats.meals.map((meal, i) => (
                <motion.div
                  key={meal._id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-violet-500/10 flex items-center justify-center text-2xl flex-shrink-0" aria-hidden="true">
                    {meal.timeOfDay === 'breakfast' ? '🥪' : meal.timeOfDay === 'lunch' ? '🥗' : meal.timeOfDay === 'dinner' ? '🍲' : '🍎'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{meal.name}</p>
                    <div className="mt-1"><MealBadge timeOfDay={meal.timeOfDay} /></div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-lg font-bold text-primary-500">{meal.calories} <span className="text-xs font-medium text-slate-400">kcal</span></span>
                    <button
                      onClick={() => handleDelete(meal._id, meal.name)}
                      disabled={deleting === meal._id}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-danger-500 hover:bg-danger-500/8 transition-colors disabled:opacity-50"
                      aria-label={`Remove ${meal.name}`}
                    >
                      {deleting === meal._id
                        ? <span className="h-3.5 w-3.5 rounded-full border-2 border-slate-300 border-t-danger-500 animate-spin" aria-hidden="true" />
                        : <Trash2 className="h-4 w-4" aria-hidden="true" />
                      }
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Add Meal Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Add meal"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-surface-800 rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl border border-surface-200 dark:border-white/10 overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b border-surface-100 dark:border-white/8">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Meal</h3>
                <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-white/8 transition-colors" aria-label="Close">
                  <X className="h-4.5 w-4.5" aria-hidden="true" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto scrollbar-hide space-y-5">
                {/* Time selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Meal Time</label>
                  <div className="grid grid-cols-4 gap-2">
                    {TIME_OPTIONS.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setTimeOfDay(value)}
                        className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-semibold transition-all ${
                          timeOfDay === value
                            ? 'bg-gradient-to-br from-primary-500 to-violet-600 text-white shadow-lg shadow-primary-500/25'
                            : 'bg-surface-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-surface-100 dark:hover:bg-white/8'
                        }`}
                        aria-pressed={timeOfDay === value}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search */}
                <div>
                  <label htmlFor="food-search" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Search Food</label>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" aria-hidden="true" />
                    <input
                      id="food-search"
                      type="search"
                      placeholder="Search 500+ foods…"
                      className="input pl-11"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Food list */}
                <div className="space-y-2" role="list" aria-label="Food options">
                  {filtered.length === 0 ? (
                    <p className="text-center text-sm text-slate-400 py-8">No foods found for "{search}"</p>
                  ) : (
                    filtered.map(food => (
                      <button
                        key={food._id}
                        type="button"
                        role="listitem"
                        onClick={() => handleAddMeal(food)}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-surface-100 dark:border-white/8 hover:border-primary-500/50 hover:bg-primary-50/50 dark:hover:bg-primary-500/5 transition-all group text-left"
                      >
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{food.name}</p>
                          <div className="flex gap-3 mt-1">
                            <span className="text-xs text-slate-500"><span className="text-blue-500 font-semibold">{food.protein}g</span> protein</span>
                            <span className="text-xs text-slate-500"><span className="text-orange-500 font-semibold">{food.carbs}g</span> carbs</span>
                            <span className="text-xs text-slate-500"><span className="text-yellow-500 font-semibold">{food.fat}g</span> fat</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span className="text-base font-bold text-slate-900 dark:text-white">{food.calories}</span>
                          <span className="text-xs text-slate-400">kcal</span>
                          <div className="w-7 h-7 rounded-lg bg-primary-500/10 group-hover:bg-primary-500 flex items-center justify-center transition-colors">
                            <Plus className="h-3.5 w-3.5 text-primary-500 group-hover:text-white transition-colors" aria-hidden="true" />
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tracker;
