import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import AnimatedPage from "../../components/common/AnimatedPage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getRideHistory } from "../../api/ridesApi";
import { formatPrice, formatDistance, formatDateTime } from "../../utils/formatters";
import { listItem, staggerContainer } from "../../styles/animations";

export default function RiderHistoryPage() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRideHistory()
      .then((r) => setRides(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><LoadingSpinner text="Loading history..." /></>;

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Ride History</h1>

        {rides.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">{"\uD83D\uDCCB"}</p>
            <p className="text-slate-400 text-lg">No rides yet. Request your first ride!</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
            {rides.map((ride) => (
              <motion.div
                key={ride.id}
                variants={listItem}
                className="p-5 bg-white/5 border border-white/10 rounded-2xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">
                      {ride.ride_request?.pickup_city || "Unknown"} {"\u2192"} {ride.ride_request?.dropoff_city || "Unknown"}
                    </p>
                    <p className="text-sm text-slate-400 mt-1">
                      Driver: {ride.driver?.full_name} | {formatDistance(ride.distance_miles)} | {formatDateTime(ride.created_at)}
                    </p>
                    {ride.driver_vehicle && (
                      <p className="text-xs text-slate-500 mt-0.5">{ride.driver_vehicle}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">{formatPrice(ride.final_price)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatedPage>
    </>
  );
}
