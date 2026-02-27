import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import AnimatedPage from "../../components/common/AnimatedPage";
import DriverOffersList from "../../components/rider/DriverOffersList";
import MapView from "../../components/common/MapView";
import StatusBadge from "../../components/common/StatusBadge";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useWebSocket } from "../../hooks/useWebSocket";
import { getRideRequest, listRideOffers, acceptOffer } from "../../api/ridesApi";
import { formatPrice, formatDistance } from "../../utils/formatters";

export default function RideOffersPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [rideRequest, setRideRequest] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    Promise.all([
      getRideRequest(requestId).then((r) => setRideRequest(r.data)),
      listRideOffers(requestId).then((r) => setOffers(r.data || [])),
    ]).finally(() => setLoading(false));
  }, [requestId]);

  const handleWsMessage = useCallback((msg) => {
    if (msg.type === "new_offer") {
      setOffers((prev) => {
        const exists = prev.find((o) => o.id === msg.offer.id);
        if (exists) return prev;
        return [...prev, msg.offer];
      });
    } else if (msg.type === "offer_updated") {
      setOffers((prev) => prev.map((o) => (o.id === msg.offer.id ? msg.offer : o)));
    } else if (msg.type === "offer_withdrawn") {
      setOffers((prev) => prev.filter((o) => o.id !== msg.offer_id));
    } else if (msg.type === "ride_confirmed") {
      setConfirmed(msg.data);
    }
  }, []);

  useWebSocket(`/ws/rides/rider/${requestId}/`, {
    onMessage: handleWsMessage,
    enabled: !!requestId && !confirmed,
  });

  const handleAccept = async (offerId) => {
    setAccepting(true);
    try {
      await acceptOffer(offerId);
      const accepted = offers.find((o) => o.id === offerId);
      setConfirmed({
        driver: accepted?.driver,
        price: accepted?.price,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return <><Navbar /><LoadingSpinner text="Loading ride details..." /></>;

  if (confirmed) {
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
            {"\u2705"}
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-3">Ride Confirmed!</h1>
          <p className="text-lg text-slate-400 mb-6">
            Your driver <span className="text-white font-medium">{confirmed.driver?.full_name}</span> is on the way!
          </p>
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl inline-block">
            <p className="text-sm text-slate-400 mb-1">Agreed Price</p>
            <p className="text-4xl font-bold text-green-400">{formatPrice(confirmed.price)}</p>
          </div>
          <div className="mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate("/rider")}
              className="px-8 py-3 bg-primary-500 text-white rounded-xl font-medium"
            >
              Back to Dashboard
            </motion.button>
          </div>
        </AnimatedPage>
      </>
    );
  }

  const pickup = rideRequest
    ? { lat: rideRequest.pickup_lat, lng: rideRequest.pickup_lng, city: rideRequest.pickup_city, state: rideRequest.pickup_state }
    : null;
  const dropoff = rideRequest
    ? { lat: rideRequest.dropoff_lat, lng: rideRequest.dropoff_lng, city: rideRequest.dropoff_city, state: rideRequest.dropoff_state }
    : null;

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Driver Offers</h1>
            <p className="text-slate-400 mt-1">
              {rideRequest?.pickup_city} {"\u2192"} {rideRequest?.dropoff_city} |{" "}
              {formatDistance(rideRequest?.distance_miles)} | Suggested {formatPrice(rideRequest?.suggested_price)}
            </p>
          </div>
          <StatusBadge status={rideRequest?.status} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <DriverOffersList offers={offers} onAccept={handleAccept} isAccepting={accepting} />
          </div>
          <div className="h-[500px] sticky top-24">
            <MapView pickup={pickup} dropoff={dropoff} className="h-full" />
          </div>
        </div>
      </AnimatedPage>
    </>
  );
}
