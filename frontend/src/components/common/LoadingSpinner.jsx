import { motion } from "framer-motion";

export default function LoadingSpinner({ size = "lg", text = "" }) {
  const sizes = { sm: "w-6 h-6", md: "w-10 h-10", lg: "w-16 h-16" };

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizes[size]} border-4 border-primary-500/20 border-t-primary-500 rounded-full`}
      />
      {text && <p className="text-slate-400 text-sm">{text}</p>}
    </div>
  );
}
