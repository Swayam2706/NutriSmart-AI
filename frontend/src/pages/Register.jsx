import { useState, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Activity, ChevronRight } from 'lucide-react';

const STEPS = ['Account', 'Body Stats', 'Goals'];

const Register = () => {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep]       = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({
    name: '', email: '', password: '',
    age: '', weight: '', height: '',
    diet: 'veg', goal: 'maintain',
  });

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setError('');
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim()) return 'Name is required';
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return 'Valid email is required';
      if (form.password.length < 6) return 'Password must be at least 6 characters';
    }
    if (step === 1) {
      if (!form.age || form.age < 1) return 'Valid age is required';
      if (!form.weight || form.weight < 1) return 'Valid weight is required';
      if (!form.height || form.height < 50) return 'Valid height is required';
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...form, age: Number(form.age), weight: Number(form.weight), height: Number(form.height) });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'input';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-to-br from-violet-600 to-primary-600 items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent)]" aria-hidden="true" />
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative z-10 text-white max-w-xs">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-xl">
            <Activity className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4 leading-tight">Start your health journey today</h2>
          <p className="text-violet-100 leading-relaxed">Create your free account and get personalized nutrition guidance in minutes.</p>
        </motion.div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/5 animate-float" aria-hidden="true" />
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-surface-50 dark:bg-surface-950 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-lg">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8" role="list" aria-label="Registration steps">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2" role="listitem">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < step ? 'bg-primary-500 text-white' :
                  i === step ? 'bg-primary-500 text-white ring-4 ring-primary-500/20' :
                  'bg-surface-200 dark:bg-white/10 text-slate-400'
                }`} aria-current={i === step ? 'step' : undefined}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{s}</span>
                {i < STEPS.length - 1 && <ChevronRight className="h-4 w-4 text-slate-300 dark:text-white/20" aria-hidden="true" />}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">{STEPS[step]}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {step === 0 && 'Set up your login credentials'}
              {step === 1 && 'Help us calculate your calorie needs'}
              {step === 2 && 'Choose your diet and fitness goal'}
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} role="alert"
              className="flex items-center gap-2.5 p-3.5 rounded-xl bg-danger-500/8 border border-danger-500/20 text-danger-500 text-sm font-medium mb-5">
              {error}
            </motion.div>
          )}

          <form onSubmit={step < 2 ? (e) => { e.preventDefault(); nextStep(); } : handleSubmit} noValidate className="space-y-4" aria-label="Registration form">

            {/* Step 0: Account */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" aria-hidden="true" />
                    <input id="name" name="name" type="text" autoComplete="name" required className={`${inputClass} pl-11`} placeholder="Alex Johnson" value={form.name} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" aria-hidden="true" />
                    <input id="reg-email" name="email" type="email" autoComplete="email" required className={`${inputClass} pl-11`} placeholder="alex@example.com" value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div>
                  <label htmlFor="reg-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Password <span className="text-slate-400 font-normal">(min. 6 characters)</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" aria-hidden="true" />
                    <input id="reg-password" name="password" type={showPass ? 'text' : 'password'} autoComplete="new-password" required className={`${inputClass} pl-11 pr-11`} placeholder="••••••••" value={form.password} onChange={handleChange} />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors" aria-label={showPass ? 'Hide password' : 'Show password'}>
                      {showPass ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Body Stats */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'age',    label: 'Age',        unit: 'yrs', min: 1,  max: 120, step: 1,   placeholder: '25' },
                    { id: 'weight', label: 'Weight',     unit: 'kg',  min: 1,  max: 500, step: 0.1, placeholder: '70' },
                    { id: 'height', label: 'Height',     unit: 'cm',  min: 50, max: 300, step: 1,   placeholder: '175' },
                  ].map(({ id, label, unit, ...rest }) => (
                    <div key={id}>
                      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        {label} <span className="text-slate-400 font-normal text-xs">({unit})</span>
                      </label>
                      <input id={id} name={id} type="number" required className={inputClass} value={form[id]} onChange={handleChange} {...rest} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Goals */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <fieldset>
                  <legend className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Diet Preference</legend>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ value: 'veg', label: '🥦 Vegetarian' }, { value: 'non-veg', label: '🍗 Non-Vegetarian' }].map(({ value, label }) => (
                      <label key={value} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.diet === value ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-surface-200 dark:border-white/10 hover:border-primary-300'}`}>
                        <input type="radio" name="diet" value={value} checked={form.diet === value} onChange={handleChange} className="sr-only" />
                        <span className="text-sm font-semibold text-slate-800 dark:text-white">{label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Fitness Goal</legend>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'lose',     label: '🔥 Lose',     desc: 'Weight loss' },
                      { value: 'maintain', label: '⚖️ Maintain', desc: 'Stay fit' },
                      { value: 'gain',     label: '💪 Gain',     desc: 'Muscle gain' },
                    ].map(({ value, label, desc }) => (
                      <label key={value} className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${form.goal === value ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-surface-200 dark:border-white/10 hover:border-primary-300'}`}>
                        <input type="radio" name="goal" value={value} checked={form.goal === value} onChange={handleChange} className="sr-only" />
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{label}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{desc}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </motion.div>
            )}

            <div className="flex items-center gap-3 pt-2">
              {step > 0 && (
                <button type="button" onClick={() => setStep(s => s - 1)} className="btn-secondary flex-1 py-3 rounded-xl">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 text-base rounded-xl">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden="true" />
                    Creating account…
                  </span>
                ) : step < 2 ? (
                  <>Continue <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" /></>
                ) : (
                  <>Create Account <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" /></>
                )}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-500 hover:text-primary-600 transition-colors">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
