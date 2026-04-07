import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import StatCard from '../components/ui/StatCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import ProgressRing from '../components/ui/ProgressRing';
import { Activity, Flame, Scale, TrendingUp, ArrowRight, Utensils, Target, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BMI_CATEGORY = (bmi) => {
  const n = Number(bmi);
  if (n < 18.5) return { label: 'Underweight', color: 'text-blue-500' };
  if (n < 25)   return { label: 'Normal',       color: 'text-accent-500' };
  if (n < 30)   return { label: 'Overweight',   color: 'text-warning-500' };
  return              { label: 'Obese',          color: 'text-danger-500' };
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-900 border border-white/10 rounded-xl px-4 py-2.5 shadow-2xl">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-white">{payload[0].value} <span className="text-slate-400 font-normal">kcal</span></p>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tracker/today')
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const consumed  = stats?.totalCaloriesCons || 0;
  const goal      = stats?.dailyGoal || user?.dailyCaloriesGoal || 2000;
  const remaining = Math.max(0, goal - consumed);
  const pct       = Math.min((consumed / goal) * 100, 100);
  const bmiInfo   = user ? BMI_CATEGORY(user.bmi) : null;

  const chartData = [
    { name: 'Consumed',  value: consumed },
    { name: 'Remaining', value: remaining },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── Greeting ── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary-500" aria-hidden="true" />
            Here's your nutrition snapshot for today
          </p>
        </div>
        <Link to="/tracker" className="btn-primary self-start sm:self-auto">
          Log a meal <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </motion.div>

      {/* ── Stat Cards ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} lines={2} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Scale}      label="BMI"         value={user?.bmi}              color="blue"    index={0} />
          <StatCard icon={Flame}      label="Daily Goal"  value={goal}    unit="kcal"    color="amber"   index={1} />
          <StatCard icon={Activity}   label="Consumed"    value={consumed} unit="kcal"   color="violet"  index={2} onClick={() => window.location.href='/tracker'} />
          <StatCard icon={TrendingUp} label="Goal"        value={user?.goal} color="emerald" index={3} />
        </div>
      )}

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Calories overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Calories Overview</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Today's intake vs goal</p>
            </div>
            <Link to="/tracker" className="btn-ghost text-xs px-3 py-1.5 rounded-lg">
              View all →
            </Link>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{consumed} kcal consumed</span>
              <span className="font-semibold text-slate-500">{goal} kcal goal</span>
            </div>
            <div className="w-full h-3 bg-surface-100 dark:bg-white/8 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Calorie progress">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
                className={`h-full rounded-full ${pct >= 100 ? 'bg-gradient-to-r from-danger-400 to-danger-500' : 'bg-gradient-to-r from-primary-500 to-violet-500'}`}
              />
            </div>
            <p className="text-right text-xs font-semibold mt-1.5">
              {pct >= 100
                ? <span className="text-danger-500">Goal exceeded!</span>
                : <span className="text-primary-500">{remaining} kcal remaining</span>
              }
            </p>
          </div>

          {/* Bar chart */}
          <div className="h-52 bg-surface-50 dark:bg-white/3 rounded-xl p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148,163,184,0.06)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={64}>
                  <Cell fill="url(#gradPrimary)" />
                  <Cell fill="#334155" />
                </Bar>
                <defs>
                  <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-5">
          {/* BMI card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-6">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Body Mass Index</h2>
            <div className="flex items-center gap-5">
              <ProgressRing value={Math.min(Number(user?.bmi || 0), 40)} max={40} size={90} strokeWidth={8} color="#3b82f6" />
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{user?.bmi}</p>
                {bmiInfo && <p className={`text-sm font-semibold mt-0.5 ${bmiInfo.color}`}>{bmiInfo.label}</p>}
                <p className="text-xs text-slate-400 mt-1">kg/m²</p>
              </div>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-5 space-y-2">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h2>
            {[
              { to: '/recommendations', icon: Sparkles, label: 'Get meal suggestions', color: 'text-violet-500 bg-violet-500/10' },
              { to: '/tracker',         icon: Utensils,  label: 'Log today\'s meals',   color: 'text-primary-500 bg-primary-500/10' },
              { to: '/habits',          icon: Target,    label: 'Check habit streaks',  color: 'text-accent-500 bg-accent-500/10' },
            ].map(({ to, icon: Icon, label, color }) => (
              <Link key={to} to={to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-white/5 transition-colors group">
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
                <ArrowRight className="h-4 w-4 text-slate-300 dark:text-white/20 ml-auto group-hover:text-primary-500 transition-colors" aria-hidden="true" />
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Today's meals preview */}
      {stats?.meals?.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Today's Meals</h2>
            <Link to="/tracker" className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.meals.slice(0, 3).map((meal, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-white/4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/10 to-violet-500/10 flex items-center justify-center text-lg flex-shrink-0">
                  {meal.timeOfDay === 'breakfast' ? '🥪' : meal.timeOfDay === 'lunch' ? '🥗' : meal.timeOfDay === 'dinner' ? '🍲' : '🍎'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{meal.name}</p>
                  <p className="text-xs text-slate-500 capitalize">{meal.timeOfDay}</p>
                </div>
                <span className="text-sm font-bold text-primary-500 ml-auto flex-shrink-0">{meal.calories}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
