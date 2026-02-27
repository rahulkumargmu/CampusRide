import { motion } from "framer-motion";

const statusConfig = {
  pending: { bg: "bg-yellow-500/20", text: "text-yellow-300", dot: "bg-yellow-400" },
  offered: { bg: "bg-blue-500/20", text: "text-blue-300", dot: "bg-blue-400" },
  accepted: { bg: "bg-green-500/20", text: "text-green-300", dot: "bg-green-400" },
  in_progress: { bg: "bg-purple-500/20", text: "text-purple-300", dot: "bg-purple-400" },
  completed: { bg: "bg-emerald-500/20", text: "text-emerald-300", dot: "bg-emerald-400" },
  cancelled: { bg: "bg-red-500/20", text: "text-red-300", dot: "bg-red-400" },
  rejected: { bg: "bg-red-500/20", text: "text-red-300", dot: "bg-red-400" },
  online: { bg: "bg-green-500/20", text: "text-green-300", dot: "bg-green-400" },
  offline: { bg: "bg-slate-500/20", text: "text-slate-300", dot: "bg-slate-400" },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <motion.span
        animate={status === "pending" || status === "in_progress" ? { opacity: [1, 0.3, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
      />
      {status.replace("_", " ")}
    </span>
  );
}
