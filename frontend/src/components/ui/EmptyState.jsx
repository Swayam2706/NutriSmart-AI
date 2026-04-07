import { motion } from 'framer-motion';

/**
 * Empty state component with icon, title, description, and optional CTA.
 */
const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 px-6 text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/10 to-violet-500/10 flex items-center justify-center mb-5 ring-1 ring-primary-500/20">
      {Icon && <Icon className="h-8 w-8 text-primary-500" aria-hidden="true" />}
    </div>
    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">{description}</p>
    {action && action}
  </motion.div>
);

export default EmptyState;
