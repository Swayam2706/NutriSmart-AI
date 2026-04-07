import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import Spinner from '../components/ui/Spinner';
import { CheckCircle2, Circle, Trophy, Target, Flame, Calendar } from 'lucide-react';

const TODAY = new Date().toISOString().split('T')[0];

const StreakBadge = ({ streak }) => {
  if (streak === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
      <Flame className="h-3 w-3" aria-hidden="true" />
      {streak} day{streak !== 1 ? 's' : ''}
    </span>
  );
};

const HabitRow = ({ habit, onComplete, completing }) => {
  const done = habit.lastCompleted === TODAY;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
        done
          ? 'bg-accent-500/5 border-accent-500/20 dark:bg-accent-500/8'
          : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-white/8 hover:border-primary-500/30 hover:shadow-md'
      }`}
    >
      {/* Check button */}
      <button
        onClick={() => !done && onComplete(habit._id)}
        disabled={done || completing === habit._id}
        className={`flex-shrink-0 transition-all duration-300 ${done ? 'cursor-default' : 'hover:scale-110 active:scale-95'}`}
        aria-label={done ? `${habit.name} completed` : `Mark ${habit.name} as complete`}
        aria-pressed={done}
      >
        {completing === habit._id ? (
          <span className="h-8 w-8 rounded-full border-2 border-primary-300 border-t-primary-500 animate-spin block" aria-hidden="true" />
        ) : done ? (
          <CheckCircle2 className="h-8 w-8 text-accent-500 drop-shadow-sm" aria-hidden="true" />
        ) : (
          <Circle className="h-8 w-8 text-slate-300 dark:text-white/20 hover:text-primary-400 transition-colors" aria-hidden="true" />
        )}
      </button>

      {/* Habit info */}
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-base transition-all ${done ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
          {habit.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {done && <span className="text-xs font-semibold text-accent-500">✓ Done today</span>}
          <StreakBadge streak={habit.streak} />
        </div>
      </div>

      {/* Trophy */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        habit.streak > 0
          ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/25 rotate-3'
          : 'bg-surface-100 dark:bg-white/8'
      }`}>
        <Trophy className={`h-5 w-5 ${habit.streak > 0 ? 'text-white' : 'text-slate-400'}`} aria-hidden="true" />
      </div>
    </motion.div>
  );
};

const Habits = () => {
  const [habits, setHabits]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [completing, setCompleting] = useState(null);

  const fetchHabits = useCallback(async () => {
    try {
      const res = await api.get('/habits');
      setHabits(res.data.habits || []);
    } catch {
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHabits(); }, [fetchHabits]);

  const handleComplete = async (habitId) => {
    setCompleting(habitId);
    try {
      const res = await api.put(`/habits/complete/${habitId}`);
      setHabits(res.data.habits);
      toast.success('Habit completed! 🔥 Keep the streak going!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete habit');
    } finally {
      setCompleting(null);
    }
  };

  const completedCount = habits.filter(h => h.lastCompleted === TODAY).length;
  const totalStreak    = habits.reduce((sum, h) => sum + h.streak, 0);

  if (loading) return <Spinner label="Loading habits…" />;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/10 to-violet-500/10 ring-1 ring-primary-500/20 flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-primary-500" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Habit Builder</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Small steps, massive transformations. Keep your streaks alive.
        </p>
      </motion.div>

      {/* ── Stats row ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4">
        {[
          { label: 'Today',       value: `${completedCount}/${habits.length}`, icon: Calendar, color: 'text-primary-500 bg-primary-500/10' },
          { label: 'Total Streak', value: totalStreak,                          icon: Flame,    color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Habits',      value: habits.length,                         icon: Target,   color: 'text-violet-500 bg-violet-500/10' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Habits list ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 dark:border-white/8 bg-surface-50/50 dark:bg-white/2">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-primary-500" aria-hidden="true" />
            Today's Mission
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="p-4 space-y-3" role="list" aria-label="Daily habits">
          <AnimatePresence>
            {habits.map(habit => (
              <div key={habit._id} role="listitem">
                <HabitRow habit={habit} onComplete={handleComplete} completing={completing} />
              </div>
            ))}
          </AnimatePresence>
        </div>

        {/* Completion banner */}
        <AnimatePresence>
          {completedCount === habits.length && habits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-r from-accent-500/10 to-primary-500/10 border border-accent-500/20 text-center"
              role="status"
              aria-live="polite"
            >
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">🎉 All habits done!</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">You're crushing it today. See you tomorrow!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Habits;
