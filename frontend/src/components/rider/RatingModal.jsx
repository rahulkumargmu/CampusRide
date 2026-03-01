import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.button
            key={i}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i)}
            className={`text-4xl leading-none transition-colors duration-100 ${
              active >= i ? "text-yellow-400" : "text-slate-600"
            }`}
          >
            ★
          </motion.button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {active > 0 && (
          <motion.p
            key={active}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="text-sm font-medium text-yellow-400"
          >
            {labels[active]}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Props:
 *  ride        – CompletedRide object (must have id, driver, ride_request, driver_vehicle)
 *  onSubmit    – async fn({ ride_id, rating, review_text }) → void
 *  onSkip      – fn() → void
 *  total       – total pending ratings count (for "1 of N" display)
 *  current     – current index (1-based)
 */
export default function RatingModal({ ride, onSubmit, onSkip, total = 1, current = 1 }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit({ ride_id: ride.id, rating, review_text: review });
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const driver = ride?.driver;
  const from = ride?.ride_request?.pickup_city || "Pickup";
  const to = ride?.ride_request?.dropoff_city || "Dropoff";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Rate your driver</h2>
            {total > 1 && (
              <p className="text-xs text-slate-500 mt-0.5">{current} of {total} pending</p>
            )}
          </div>
          <button
            onClick={onSkip}
            className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
          >
            Skip
          </button>
        </div>

        {/* Driver card */}
        <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
            {driver?.full_name?.[0] || "D"}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white">{driver?.full_name}</p>
            {ride.driver_vehicle && (
              <p className="text-xs text-slate-400 truncate">{ride.driver_vehicle}</p>
            )}
            <p className="text-xs text-slate-500 mt-0.5">
              {from} → {to}
            </p>
          </div>
        </div>

        {/* Star picker */}
        <div className="mb-5">
          <p className="text-sm text-slate-400 text-center mb-3">How was your ride?</p>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        {/* Review text */}
        <div className="mb-5">
          <label className="block text-xs text-slate-400 mb-1.5">
            Leave a short review <span className="text-slate-600">(optional)</span>
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Great ride! Very punctual and friendly driver..."
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none text-sm transition-all"
          />
          <p className="text-right text-xs text-slate-600 mt-1">{review.length}/300</p>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onSkip}
            className="flex-1 py-3 text-sm font-medium text-slate-400 border border-white/10 rounded-xl hover:bg-white/5 transition-all"
          >
            Skip for now
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={loading || !rating}
            className="flex-1 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all disabled:opacity-40"
          >
            {loading ? "Submitting..." : "Submit Rating"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
