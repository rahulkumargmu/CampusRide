import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import AnimatedPage from "../../components/common/AnimatedPage";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useAuth } from "../../context/AuthContext";
import { getActiveRide, listRideRequests } from "../../api/ridesApi";
import { formatPrice, formatDistance, formatTimeAgo, getGreeting } from "../../utils/formatters";
import { fadeInUp, staggerContainer } from "../../styles/animations";
import { RideSharingIllustration } from "../../components/common/Illustrations";

export default function RiderDashboard() {
  const { user } = useAuth();
  const [activeRide, setActiveRide] = useState(null);
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getActiveRide().then((r) => setActiveRide(r.data)),
      listRideRequests().then((r) => setRecentRides(r.data.slice(0, 5))),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><LoadingSpinner text="Loading dashboard..." /></>;

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome with illustration */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-400 mb-1">{getGreeting()}</p>
            <h1 className="text-3xl font-bold text-white">
              Hello, {user?.full_name?.split(" ")[0]}! {"\uD83D\uDC4B"}
            </h1>
            <p className="text-slate-400 mt-1">Ready to find a ride?</p>
          </div>
          <div className="hidden md:block w-64">
            <RideSharingIllustration />
          </div>
        </motion.div>

        {/* Active Ride */}
        {activeRide && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white text-lg">Active Ride</h3>
              <StatusBadge status={activeRide.status} />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-400">
                {"\uD83D\uDCCD"} {activeRide.pickup_city}, {activeRide.pickup_state}
              </span>
              <span className="text-primary-400">{"\u2192"}</span>
              <span className="text-slate-400">
                {"\uD83C\uDFC1"} {activeRide.dropoff_city}, {activeRide.dropoff_state}
              </span>
            </div>
            {activeRide.status === "pending" || activeRide.status === "offered" ? (
              <Link to={`/rider/offers/${activeRide.id}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium"
                >
                  View Offers
                </motion.button>
              </Link>
            ) : null}
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { to: "/rider/request", icon: "\uD83D\uDE97", title: "Request a Ride", desc: "Find drivers near you", gradient: "from-primary-500/20 to-blue-500/20", border: "border-primary-500/20" },
            { to: "/rider/history", icon: "\uD83D\uDCCB", title: "Ride History", desc: "View past rides", gradient: "from-accent-500/20 to-purple-500/20", border: "border-accent-500/20" },
            { to: "/rider/request", icon: "\uD83D\uDCB0", title: "Save Money", desc: "$0.50/mile avg", gradient: "from-green-500/20 to-emerald-500/20", border: "border-green-500/20" },
          ].map((action) => (
            <Link key={action.to + action.title} to={action.to}>
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.03, y: -3 }}
                className={`p-6 bg-gradient-to-br ${action.gradient} border ${action.border} rounded-2xl cursor-pointer`}
              >
                <span className="text-3xl block mb-3">{action.icon}</span>
                <h3 className="font-semibold text-white">{action.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{action.desc}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Recent Rides */}
        {recentRides.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <h2 className="text-xl font-semibold text-white mb-4">Recent Rides</h2>
            <div className="space-y-3">
              {recentRides.map((ride) => (
                <div key={ride.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-white font-medium">
                        {ride.pickup_city} {"\u2192"} {ride.dropoff_city}
                      </p>
                      <p className="text-xs text-slate-500">{formatTimeAgo(ride.created_at)} | {formatDistance(ride.distance_miles)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-green-400">{formatPrice(ride.suggested_price)}</span>
                    <StatusBadge status={ride.status} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatedPage>
    </>
  );
}
