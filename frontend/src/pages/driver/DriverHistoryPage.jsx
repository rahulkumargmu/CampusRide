import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import AnimatedPage from "../../components/common/AnimatedPage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getRideHistory } from "../../api/ridesApi";
import { formatPrice, formatDistance, formatDateTime } from "../../utils/formatters";
import { listItem, staggerContainer } from "../../styles/animations";

export default function DriverHistoryPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRideHistory()
      .then((r) => setRides(r.data))
      .finally(() => setLoading(false));
  }, []);

  const totalEarnings = rides.reduce((sum, r) => sum + Number(r.final_price || 0), 0);
  const completedCount = rides.filter((r) => r.is_completed).length;

  if (loading) return <><Navbar /><LoadingSpinner text="Loading history..." /></>;

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Ride History</h1>
            <p className="text-slate-400 mt-1">People you helped get around campus</p>
          </div>
          {rides.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-slate-400">Total Earnings</p>
              <p className="text-2xl font-bold text-green-400">{formatPrice(totalEarnings)}</p>
              <p className="text-xs text-slate-500 mt-1">{completedCount} completed | {rides.length - completedCount} in progress</p>
            </div>
          )}
        </div>

        {rides.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">{"\uD83D\uDE97"}</p>
            <p className="text-slate-400 text-lg">No rides yet</p>
            <p className="text-slate-500 text-sm mt-1">Accepted rides will appear here automatically</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
            {rides.map((ride) => (
              <motion.div
                key={ride.id}
                variants={listItem}
                className={`p-5 rounded-2xl flex items-center justify-between ${
                  ride.is_completed
                    ? "bg-white/5 border border-white/10"
                    : "bg-primary-500/5 border border-primary-500/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    ride.is_completed
                      ? "bg-green-500/20"
                      : "bg-primary-500/20"
                  }`}>
                    {ride.rider?.full_name?.[0] || "R"}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {ride.ride_request?.pickup_city || "Pickup"} {"\u2192"} {ride.ride_request?.dropoff_city || "Dropoff"}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Helped: {ride.rider?.full_name} | {formatDistance(ride.distance_miles)} | {formatDateTime(ride.created_at)}
                    </p>
                    {ride.driver_vehicle && (
                      <p className="text-xs text-slate-500 mt-0.5">{ride.driver_vehicle}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-400">{formatPrice(ride.final_price)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    ride.is_completed
                      ? "bg-green-500/10 text-green-400"
                      : "bg-primary-500/10 text-primary-400"
                  }`}>
                    {ride.is_completed ? "Completed" : "In Progress"}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatedPage>
    </>
  );
}
