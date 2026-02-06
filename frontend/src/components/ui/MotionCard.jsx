import { motion } from 'framer-motion';

/**
 * MotionCard — reusable wrapper with hover lift + tap squeeze.
 * Drop-in replacement for any card / panel.
 *
 * Props:
 *   hover   – enable lift-on-hover   (default true)
 *   tap     – enable press-squeeze   (default true)
 *   glow    – add red glow on hover  (default false)
 *   delay   – entrance animation delay
 *   className / children – standard
 */
export default function MotionCard({
  children,
  hover = true,
  tap = true,
  glow = false,
  delay = 0,
  className = '',
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      whileHover={hover ? { y: -5, transition: { duration: 0.22 } } : undefined}
      whileTap={tap ? { scale: 0.97 } : undefined}
      className={`
        bg-surface border border-surface-border rounded-2xl p-6
        transition-colors duration-200
        ${glow ? 'hover:shadow-glow hover:border-accent/25' : 'hover:border-surface-hover'}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
