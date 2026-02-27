import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import AnimatedPage from "../../components/common/AnimatedPage";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getStats, getOnlineUsers } from "../../api/adminApi";
import { fadeInUp, staggerContainer } from "../../styles/animations";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStats().then((r) => setStats(r.data)),
      getOnlineUsers().then((r) => setOnlineUsers(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><LoadingSpinner text="Loading admin dashboard..." /></>;

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-6xl mx-auto px-4 py-8">
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Monitor and manage the platform</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: "Total Users", value: stats?.total_users || 0, icon: "\uD83D\uDC65", color: "from-blue-500/20 to-cyan-500/20" },
            { label: "Drivers", value: stats?.total_drivers || 0, icon: "\uD83D\uDE97", color: "from-green-500/20 to-emerald-500/20" },
            { label: "Riders", value: stats?.total_riders || 0, icon: "\uD83D\uDEB6", color: "from-purple-500/20 to-pink-500/20" },
            { label: "Online Now", value: stats?.online_users || 0, icon: "\uD83D\uDFE2", color: "from-green-500/20 to-lime-500/20" },
            { label: "Active Rides", value: stats?.active_rides || 0, icon: "\uD83D\uDCCD", color: "from-orange-500/20 to-amber-500/20" },
            { label: "Completed", value: stats?.completed_rides || 0, icon: "\u2705", color: "from-teal-500/20 to-cyan-500/20" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -3 }}
              className={`p-4 bg-gradient-to-br ${stat.color} border border-white/10 rounded-2xl text-center`}
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/admin/users">
            <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-primary-500/10 border border-primary-500/20 rounded-2xl cursor-pointer">
              <span className="text-3xl block mb-3">{"\uD83D\uDC65"}</span>
              <h3 className="font-semibold text-white">Manage Users</h3>
              <p className="text-sm text-slate-400 mt-1">Add, remove, and view all members</p>
            </motion.div>
          </Link>
          <Link to="/admin/rides">
            <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-accent-500/10 border border-accent-500/20 rounded-2xl cursor-pointer">
              <span className="text-3xl block mb-3">{"\uD83D\uDDFA\uFE0F"}</span>
              <h3 className="font-semibold text-white">Monitor Rides</h3>
              <p className="text-sm text-slate-400 mt-1">Track active and completed rides</p>
            </motion.div>
          </Link>
        </div>

        {/* Online Users */}
        {onlineUsers.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Currently Online ({onlineUsers.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {onlineUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.full_name?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{user.full_name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  <StatusBadge status="online" />
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === "driver" ? "bg-blue-500/20 text-blue-300" : "bg-purple-500/20 text-purple-300"
                  }`}>
                    {user.role}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </AnimatedPage>
    </>
  );
}
