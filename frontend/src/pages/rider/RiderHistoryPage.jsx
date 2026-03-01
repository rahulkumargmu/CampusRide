import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/common/Navbar";
import AnimatedPage from "../../components/common/AnimatedPage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import StarRating from "../../components/common/StarRating";
import RatingModal from "../../components/rider/RatingModal";
import { getRideHistory, rateRide } from "../../api/ridesApi";
import { getFavourites, toggleFavourite } from "../../api/authApi";
import { formatPrice, formatDistance, formatDateTime } from "../../utils/formatters";
import { listItem, staggerContainer } from "../../styles/animations";

function HeartIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`w-5 h-5 transition-all duration-200 ${filled ? "text-red-400 fill-current" : "text-slate-500 fill-transparent stroke-current stroke-2"}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
}

function RideCard({ ride, isFav, onToggleFav, onRate, favLoading }) {
  const from = ride.ride_request?.pickup_city || "Unknown";
  const to = ride.ride_request?.dropoff_city || "Unknown";
  const hasRated = ride.driver_rating !== null && ride.driver_rating !== undefined;
  const canRate = ride.is_completed && !hasRated;

  return (
    <motion.div
      variants={listItem}
      layout
      className={`p-5 rounded-2xl border transition-all ${
        isFav
          ? "bg-gradient-to-r from-red-500/5 to-pink-500/5 border-red-500/20"
          : "bg-white/5 border-white/10"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Driver avatar */}
        <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0">
          {ride.driver?.full_name?.[0] || "D"}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-white font-semibold truncate">
                {from} → {to}
              </p>
              <p className="text-sm text-slate-400 mt-0.5">
                Driver: <span className="text-slate-300">{ride.driver?.full_name}</span>
                {" · "}{formatDistance(ride.distance_miles)}
                {" · "}{formatDateTime(ride.created_at)}
              </p>
              {ride.driver_vehicle && (
                <p className="text-xs text-slate-500 mt-0.5">{ride.driver_vehicle}</p>
              )}
            </div>

            {/* Price + fav button */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <p className="text-xl font-bold text-green-400">{formatPrice(ride.final_price)}</p>
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={() => onToggleFav(ride.driver?.id)}
                disabled={favLoading === ride.driver?.id}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                title={isFav ? "Remove from favourites" : "Mark as favourite driver"}
              >
                <HeartIcon filled={isFav} />
              </motion.button>
            </div>
          </div>

          {/* Rating row */}
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            {/* Driver's overall rating */}
            <StarRating rating={ride.driver_profile_rating || 5} size="sm" />

            {/* Per-ride rating badge */}
            {hasRated && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs text-yellow-400">
                You rated: {ride.driver_rating}★
                {ride.review_text && (
                  <span className="text-yellow-300/70 italic ml-1">"{ride.review_text}"</span>
                )}
              </span>
            )}

            {/* Rate button */}
            {canRate && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onRate(ride)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-500/10 border border-primary-500/30 text-primary-300 rounded-full text-xs font-medium hover:bg-primary-500/20 transition-all"
              >
                ★ Rate this ride
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function RiderHistoryPage() {
  const [rides, setRides] = useState([]);
  const [favourites, setFavourites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(null);
  const [ratingRide, setRatingRide] = useState(null);

  useEffect(() => {
    Promise.all([
      getRideHistory().then((r) => setRides(r.data)),
      getFavourites().then((r) => setFavourites(new Set(r.data))).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const handleToggleFav = useCallback(async (driverId) => {
    if (!driverId) return;
    setFavLoading(driverId);
    try {
      const { data } = await toggleFavourite(driverId);
      setFavourites((prev) => {
        const next = new Set(prev);
        data.favourited ? next.add(driverId) : next.delete(driverId);
        return next;
      });
    } catch {
      // ignore
    } finally {
      setFavLoading(null);
    }
  }, []);

  const handleRatingSubmit = async (payload) => {
    await rateRide(payload);
    setRides((prev) =>
      prev.map((r) =>
        r.id === payload.ride_id
          ? { ...r, driver_rating: payload.rating, review_text: payload.review_text }
          : r
      )
    );
    setRatingRide(null);
  };

  if (loading) return <><Navbar /><LoadingSpinner text="Loading history..." /></>;

  // Split into favourite-driver rides and others
  const favRides = rides.filter((r) => favourites.has(r.driver?.id));
  const otherRides = rides.filter((r) => !favourites.has(r.driver?.id));
  const hasBoth = favRides.length > 0 && otherRides.length > 0;

  const cardProps = (ride) => ({
    ride,
    isFav: favourites.has(ride.driver?.id),
    onToggleFav: handleToggleFav,
    onRate: setRatingRide,
    favLoading,
  });

  return (
    <>
      <Navbar />

      {/* Rating Modal triggered from history page */}
      <AnimatePresence>
        {ratingRide && (
          <RatingModal
            key={ratingRide.id}
            ride={ratingRide}
            onSubmit={handleRatingSubmit}
            onSkip={() => setRatingRide(null)}
          />
        )}
      </AnimatePresence>

      <AnimatedPage className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Ride History</h1>

        {rides.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-slate-400 text-lg">No rides yet. Request your first ride!</p>
          </div>
        ) : (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
            {/* Favourite drivers section */}
            {favRides.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-red-400 text-sm font-semibold flex items-center gap-1.5">
                    <HeartIcon filled /> Favourite Drivers
                  </span>
                  <div className="flex-1 h-px bg-red-500/20" />
                  <span className="text-xs text-slate-500">{favRides.length} ride{favRides.length !== 1 ? "s" : ""}</span>
                </div>
                {favRides.map((ride) => (
                  <RideCard key={ride.id} {...cardProps(ride)} />
                ))}
              </>
            )}

            {/* Divider between sections */}
            {hasBoth && (
              <div className="flex items-center gap-3 pt-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-slate-500">Other Rides</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            )}

            {/* Other rides */}
            {otherRides.map((ride) => (
              <RideCard key={ride.id} {...cardProps(ride)} />
            ))}
          </motion.div>
        )}
      </AnimatedPage>
    </>
  );
}
