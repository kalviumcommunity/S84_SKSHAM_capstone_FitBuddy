export default function Badge({ children, variant = 'default', className = '' }) {
  const styles = {
    default: 'bg-surface-light text-muted',
    primary: 'bg-accent/15 text-accent',
    success: 'bg-emerald/15 text-emerald',
    warning: 'bg-amber/15 text-amber',
    danger:  'bg-red-500/15 text-red-400',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}
