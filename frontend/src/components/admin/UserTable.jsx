import { motion, AnimatePresence } from "framer-motion";
import StatusBadge from "../common/StatusBadge";
import { formatDateTime } from "../../utils/formatters";
import { listItem } from "../../styles/animations";

export default function UserTable({ users, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <table className="w-full">
        <thead>
          <tr className="bg-white/5">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Name</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Email</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Phone</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Role</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Joined</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          <AnimatePresence>
            {users.map((user) => (
              <motion.tr
                key={user.id}
                variants={listItem}
                initial="initial"
                animate="animate"
                exit="exit"
                className="hover:bg-white/5 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {user.full_name?.[0]}
                    </div>
                    <span className="text-sm font-medium text-white">{user.full_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{user.email}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{user.phone_number}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user.role === "driver"
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-purple-500/20 text-purple-300"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={user.is_online ? "online" : "offline"} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{formatDateTime(user.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  {user.role !== "admin" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDelete(user.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                    >
                      Remove
                    </motion.button>
                  )}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
