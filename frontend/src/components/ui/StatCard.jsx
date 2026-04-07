import { motion } from 'framer-motion';

/**
 * Animated stat card used on Dashboard.
 * @param {React.ElementType} icon - Lucide icon component
 * @param {string} label - Stat label
 * @param {string|number} value - Main value
 * @param {string} unit - Optional unit suffix
 * @param {string} color - Tailwind color key (blue, violet, emerald, amber)
 * @param {number} index - Animation stagger index
 */
const colorMap = {
  blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-500',    ring: 'ring-blue-500/20',    glow: 'shadow-blue-500/20' },
  violet:  { bg: 'bg-violet-500/10',  text: 'text-violet-500',  ring: 'ring-violet-500/20',  glow: 'shadow-violet-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', ring: 'ring-emerald-500/20', glow: 'shadow-emerald-500/20' },
  amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-500',   ring: 'ring-amber-500/20',   glow: 'shadow-amber-500/20' },
  rose:    { bg: 'bg-rose-500/10',    text: 'text-rose-500',    ring: 'ring-rose-500/20',    glow: 'shadow-rose-500/20' },
};

const StatCard = ({ icon: Icon, label, value, unit, color = 'blue', index = 0, onClick }) => {
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`card p-5 flex items-center gap-4 ${onClick ? 'cursor-pointer' : ''} hover:shadow-lg hover:${c.glow} transition-shadow duration-300`}
    >
      <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}>
        <Icon className={`h-6 w-6 ${c.text}`} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none truncate">
          {value}
          {unit && <span className="text-sm font-medium text-slate-400 ml-1">{unit}</span>}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
