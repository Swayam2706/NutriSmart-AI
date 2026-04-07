import { motion } from 'framer-motion';

/**
 * Animated circular progress ring.
 */
const ProgressRing = ({ value = 0, max = 100, size = 120, strokeWidth = 10, color = '#3b82f6' }) => {
  const pct = Math.min((value / max) * 100, 100);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width={size} height={size} role="img" aria-label={`${Math.round(pct)}% progress`}>
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
        strokeWidth={strokeWidth} className="text-surface-200 dark:text-white/8" />
      {/* Progress */}
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};

export default ProgressRing;
