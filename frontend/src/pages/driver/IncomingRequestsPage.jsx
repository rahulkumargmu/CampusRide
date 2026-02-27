import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import AnimatedPage from "../../components/common/AnimatedPage";
import RideRequestCard from "../../components/driver/RideRequestCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useWebSocket } from "../../hooks/useWebSocket";
import { listRideRequests, createRideOffer } from "../../api/ridesApi";
import { staggerContainer } from "../../styles/animations";

export default function IncomingRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptedRide, setAcceptedRide] = useState(null);

  useEffect(() => {
    listRideRequests()
      .then((r) => setRequests(r.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleWsMessage = useCallback((msg) => {
    if (msg.type === "new_ride_request") {
      setRequests((prev) => {
        const exists = prev.find((r) => r.id === msg.ride_request.id);
        if (exists) return prev;
        return [msg.ride_request, ...prev];
      });
    } else if (msg.type === "ride_cancelled") {
      setRequests((prev) => prev.filter((r) => r.id !== msg.ride_request_id));
    } else if (msg.type === "offer_accepted") {
      setAcceptedRide(msg.ride_request);
    }
  }, []);

  useWebSocket("/ws/rides/driver/", { onMessage: handleWsMessage });

  const handleSubmitOffer = async (offerData) => {
    await createRideOffer(offerData);
  };

  if (loading) return <><Navbar /><LoadingSpinner text="Loading requests..." /></>;

  if (acceptedRide) {
    return (
      <>
        <Navbar />
        <AnimatedPage className="max-w-2xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-7xl mb-6"
          >
            {"\uD83C\uDF89"}
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-3">Offer Accepted!</h1>
          <p className="text-lg text-slate-400">
            {acceptedRide.pickup_city} {"\u2192"} {acceptedRide.dropoff_city}
          </p>
          <p className="text-slate-500 mt-2">
            Rider: {acceptedRide.rider?.full_name}
          </p>
        </AnimatedPage>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Ride Requests</h1>
            <p className="text-slate-400 mt-1">
              {requests.length} active request{requests.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-green-400 rounded-full"
            />
            <span className="text-sm text-green-400">Live</span>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              {"\uD83D\uDCE1"}
            </motion.div>
            <p className="text-slate-400 text-lg">No ride requests at the moment</p>
            <p className="text-slate-500 text-sm mt-1">New requests will appear here in real-time</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
            <AnimatePresence mode="popLayout">
              {requests.map((request) => (
                <RideRequestCard
                  key={request.id}
                  request={request}
                  onSubmitOffer={handleSubmitOffer}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatedPage>
    </>
  );
}
