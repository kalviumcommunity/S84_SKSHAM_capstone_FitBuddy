import { motion } from 'framer-motion';
import { pageTransition } from '../../utils/animations';

export default function PageWrapper({ children, className = '' }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      className={`min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
}
