import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, glass = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, transition: { duration: 0.22 } } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={`
        ${glass ? 'glass-card' : 'glass-card-solid'}
        p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
