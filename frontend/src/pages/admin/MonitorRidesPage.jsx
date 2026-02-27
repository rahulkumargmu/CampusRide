import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import AnimatedPage from "../../components/common/AnimatedPage";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getAdminRides } from "../../api/adminApi";
import { formatPrice, formatDistance, formatDateTime } from "../../utils/formatters";
import { listItem, staggerContainer } from "../../styles/animations";

export default function MonitorRidesPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAdminRides()
      .then((r) => setRides(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? rides : rides.filter((r) => r.status === filter);

  if (loading) return <><Navbar /><LoadingSpinner text="Loading rides..." /></>;

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-4">Monitor Rides</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {["all", "pending", "offered", "accepted", "in_progress", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f
                  ? "bg-primary-500/20 border border-primary-500/50 text-primary-300"
                  : "bg-white/5 border border-white/10 text-slate-400 hover:text-white"
              }`}
            >
              {f === "all" ? "All" : f.replace("_", " ")}
            </button>
          ))}
        </div>

        <p className="text-sm text-slate-400 mb-4">{filtered.length} rides</p>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
          {filtered.map((ride) => (
            <motion.div
              key={ride.id}
              variants={listItem}
              className="p-5 bg-white/5 border border-white/10 rounded-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-white font-medium">
                      {ride.pickup_city}, {ride.pickup_state} {"\u2192"} {ride.dropoff_city}, {ride.dropoff_state}
                    </p>
                    <StatusBadge status={ride.status} />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>Rider: {ride.rider?.full_name}</span>
                    <span>{formatDistance(ride.distance_miles)}</span>
                    <span>{formatDateTime(ride.created_at)}</span>
                    <span>{ride.offers_count || 0} offers</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-400 ml-4">{formatPrice(ride.suggested_price)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatedPage>
    </>
  );
}
