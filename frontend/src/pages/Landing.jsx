import { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ArrowRight, Zap, Shield, TrendingUp, Utensils, Target, BarChart3 } from 'lucide-react';

const FEATURES = [
  { icon: Zap,        title: 'Smart Recommendations', desc: 'AI-powered food suggestions tailored to your diet and goals.' },
  { icon: BarChart3,  title: 'Calorie Tracking',       desc: 'Log meals effortlessly and visualize your daily intake.' },
  { icon: Target,     title: 'Habit Builder',           desc: 'Build streaks and stay consistent with healthy habits.' },
  { icon: Shield,     title: 'Personalized Goals',      desc: 'Lose, gain, or maintain — we adapt to your journey.' },
  { icon: TrendingUp, title: 'Progress Insights',       desc: 'Track BMI, calories, and trends over time.' },
  { icon: Utensils,   title: 'Rich Food Database',      desc: 'Hundreds of foods with full macro breakdowns.' },
];

const Landing = () => {
  const { user } = useContext(AuthContext);
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-20">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary-500/20 to-violet-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-violet-500/15 to-primary-500/15 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-6">
              <Zap className="h-3.5 w-3.5" aria-hidden="true" />
              AI-Powered Nutrition Tracking
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-6"
          >
            Eat Smart.{' '}
            <span className="gradient-text">Live Better.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Personalized meal recommendations, calorie tracking, and habit building — all in one place. Your nutrition journey starts here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="btn-primary px-8 py-3.5 text-base rounded-2xl shadow-xl shadow-primary-500/30">
              Get Started Free
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link to="/login" className="btn-secondary px-8 py-3.5 text-base rounded-2xl">
              Sign In
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 text-center"
          >
            {[
              { value: '500+', label: 'Foods tracked' },
              { value: '4',    label: 'Habit goals' },
              { value: '100%', label: 'Personalized' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-extrabold gradient-text">{value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4 bg-white dark:bg-surface-900" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Everything you need to{' '}
              <span className="gradient-text">stay on track</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Built for people who take their health seriously — without the complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/10 to-violet-500/10 ring-1 ring-primary-500/20 flex items-center justify-center mb-4 group-hover:from-primary-500/20 group-hover:to-violet-500/20 transition-colors">
                  <Icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary-500 to-violet-600 p-12 text-center text-white shadow-2xl shadow-primary-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none" aria-hidden="true" />
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 relative z-10">Ready to transform your nutrition?</h2>
          <p className="text-primary-100 mb-8 text-lg relative z-10">Join thousands building healthier habits every day.</p>
          <Link
            to="/register"
            className="relative z-10 inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-600 font-bold rounded-2xl hover:bg-primary-50 transition-colors shadow-lg text-base"
          >
            Start for Free <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
