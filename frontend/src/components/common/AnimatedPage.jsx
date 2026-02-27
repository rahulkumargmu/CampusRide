import { motion } from "framer-motion";
import { pageTransition } from "../../styles/animations";

export default function AnimatedPage({ children, className = "" }) {
  return (
    <motion.div
      initial={pageTransition.initial}
      animate={pageTransition.animate}
      exit={pageTransition.exit}
      className={className}
    >
      {children}
    </motion.div>
  );
}
