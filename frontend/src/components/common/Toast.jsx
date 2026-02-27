import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Toast({ message, type = "info", onClose, duration = 4000 }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const colors = {
    success: "bg-green-500/20 border-green-500/50 text-green-300",
    error: "bg-red-500/20 border-red-500/50 text-red-300",
    info: "bg-blue-500/20 border-blue-500/50 text-blue-300",
    warning: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded-xl border backdrop-blur-xl shadow-2xl ${colors[type]}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="text-white/50 hover:text-white transition">
          &times;
        </button>
      </div>
    </motion.div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const ToastContainer = () => (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </AnimatePresence>
  );

  return { addToast, ToastContainer };
}
