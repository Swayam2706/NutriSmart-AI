/** Skeleton placeholder card for loading states */
const SkeletonCard = ({ lines = 3, className = '' }) => (
  <div className={`card p-5 space-y-3 ${className}`} aria-hidden="true">
    <div className="skeleton h-4 w-2/3 rounded-lg" />
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className={`skeleton h-3 rounded-lg ${i === lines - 1 ? 'w-1/2' : 'w-full'}`} />
    ))}
  </div>
);

export default SkeletonCard;
