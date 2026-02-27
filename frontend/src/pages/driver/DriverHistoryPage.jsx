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

  if (loading) return <><Navbar /><LoadingSpinner text="Loading history..." /></>;

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Ride History</h1>
          {rides.length > 0 && (
            <div className="text-right">
              <p className="text-sm text-slate-400">Total Earnings</p>
              <p className="text-2xl font-bold text-green-400">{formatPrice(totalEarnings)}</p>
            </div>
          )}
        </div>

        {rides.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">{"\uD83D\uDE97"}</p>
            <p className="text-slate-400 text-lg">No completed rides yet</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
            {rides.map((ride) => (
              <motion.div
                key={ride.id}
                variants={listItem}
                className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <p className="text-white font-medium">
                    {ride.ride_request?.pickup_city || "Pickup"} {"\u2192"} {ride.ride_request?.dropoff_city || "Dropoff"}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Rider: {ride.rider?.full_name} | {formatDistance(ride.distance_miles)} | {formatDateTime(ride.created_at)}
                  </p>
                </div>
                <p className="text-xl font-bold text-green-400">{formatPrice(ride.final_price)}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatedPage>
    </>
  );
}
