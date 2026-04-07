/**
 * Reusable loading spinner with optional label.
 */
const Spinner = ({ size = 'md', label = 'Loading…', fullPage = false }) => {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

  const inner = (
    <div className="flex flex-col items-center gap-3" role="status" aria-label={label}>
      <div
        className={`${sizes[size]} rounded-full border-2 border-surface-200 dark:border-white/10 border-t-primary-500 animate-spin`}
      />
      {label && <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-surface-50/80 dark:bg-surface-950/80 backdrop-blur-sm z-50">
        {inner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-16">{inner}</div>;
};

export default Spinner;
