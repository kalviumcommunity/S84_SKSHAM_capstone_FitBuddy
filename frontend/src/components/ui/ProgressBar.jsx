import { motion } from 'framer-motion';

export default function ProgressBar({ value = 0, max = 100, color = 'accent', label, showValue = true, className = '' }) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const colors = {
    accent:  'bg-accent',
    green:   'bg-emerald',
    amber:   'bg-amber',
    red:     'bg-red-500',
    blue:    'bg-sky',
    violet:  'bg-violet',
  };

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-muted">{label}</span>}
          {showValue && <span className="text-sm font-bold text-[var(--text-main)]">{percentage}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-surface-light rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${colors[color] || colors.accent}`}
        />
      </div>
    </div>
  );
}
