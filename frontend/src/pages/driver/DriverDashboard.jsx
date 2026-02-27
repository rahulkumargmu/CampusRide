import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import AnimatedPage from "../../components/common/AnimatedPage";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { getActiveRide, getRideHistory } from "../../api/ridesApi";
import { getDriverProfile, updateDriverProfile } from "../../api/authApi";
import { formatPrice, formatDistance } from "../../utils/formatters";
import { fadeInUp, staggerContainer } from "../../styles/animations";

export default function DriverDashboard() {
  const { user } = useAuth();
  const [driverProfile, setDriverProfile] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [stats, setStats] = useState({ totalRides: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDriverProfile().then((r) => setDriverProfile(r.data)),
      getActiveRide().then((r) => setActiveRide(r.data)),
      getRideHistory().then((r) => {
        const rides = r.data || [];
        setStats({
          totalRides: rides.length,
          totalEarnings: rides.reduce((sum, ride) => sum + Number(ride.final_price || 0), 0),
        });
      }),
    ]).finally(() => setLoading(false));
  }, []);

  const toggleAvailability = async () => {
    try {
      const { data } = await updateDriverProfile({ is_available: !driverProfile.is_available });
      setDriverProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <><Navbar /><LoadingSpinner text="Loading dashboard..." /></>;

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-5xl mx-auto px-4 py-8">
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Hey, {user?.full_name?.split(" ")[0]}! {"\uD83D\uDE80"}
            </h1>
            <p className="text-slate-400 mt-1">Manage your rides and earnings</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleAvailability}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
              driverProfile?.is_available
                ? "bg-green-500/20 border border-green-500/50 text-green-300"
                : "bg-red-500/20 border border-red-500/50 text-red-300"
            }`}
          >
            {driverProfile?.is_available ? "Available" : "Unavailable"}
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Rides", value: stats.totalRides, icon: "\uD83D\uDE97", color: "from-blue-500/20 to-cyan-500/20" },
            { label: "Total Earnings", value: formatPrice(stats.totalEarnings), icon: "\uD83D\uDCB0", color: "from-green-500/20 to-emerald-500/20" },
            { label: "Rating", value: `${Number(driverProfile?.rating || 5).toFixed(1)} ★`, icon: "\u2B50", color: "from-yellow-500/20 to-orange-500/20" },
            { label: "Status", value: driverProfile?.is_available ? "Online" : "Offline", icon: "\uD83D\uDFE2", color: "from-purple-500/20 to-pink-500/20" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className={`p-5 bg-gradient-to-br ${stat.color} border border-white/10 rounded-2xl`}
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Active Ride */}
        {activeRide && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white text-lg">Active Ride</h3>
              <StatusBadge status={activeRide.status} />
            </div>
            <p className="text-sm text-slate-400">
              {activeRide.pickup_city} {"\u2192"} {activeRide.dropoff_city} | {formatDistance(activeRide.distance_miles)}
            </p>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/driver/requests">
            <motion.div whileHover={{ scale: 1.03, y: -3 }} className="p-6 bg-primary-500/10 border border-primary-500/20 rounded-2xl cursor-pointer">
              <span className="text-3xl block mb-3">{"\uD83D\uDCE8"}</span>
              <h3 className="font-semibold text-white">Incoming Requests</h3>
              <p className="text-sm text-slate-400 mt-1">View and bid on ride requests</p>
            </motion.div>
          </Link>
          <Link to="/driver/history">
            <motion.div whileHover={{ scale: 1.03, y: -3 }} className="p-6 bg-accent-500/10 border border-accent-500/20 rounded-2xl cursor-pointer">
              <span className="text-3xl block mb-3">{"\uD83D\uDCCB"}</span>
              <h3 className="font-semibold text-white">Ride History</h3>
              <p className="text-sm text-slate-400 mt-1">View your completed rides</p>
            </motion.div>
          </Link>
        </div>
      </AnimatedPage>
    </>
  );
}
