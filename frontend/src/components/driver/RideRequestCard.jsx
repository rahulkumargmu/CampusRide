import { useState } from "react";
import { motion } from "framer-motion";
import { formatPrice, formatDistance } from "../../utils/formatters";
import { listItem } from "../../styles/animations";

export default function RideRequestCard({ request, onSubmitOffer }) {
  const [price, setPrice] = useState(request.suggested_price || "");
  const [eta, setEta] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!price) return;
    setSubmitting(true);
    try {
      await onSubmitOffer({
        ride_request: request.id,
        price: Number(price),
        estimated_arrival_minutes: Number(eta) || 0,
        message,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        variants={listItem}
        initial="initial"
        animate="animate"
        className="p-5 bg-green-500/10 border border-green-500/20 rounded-2xl"
      >
        <p className="text-green-400 font-medium text-center">Offer sent for {formatPrice(price)}! Waiting for rider...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={listItem}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-primary-500/30 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-400">{"\uD83D\uDCCD"}</span>
            <span className="text-white font-medium">{request.pickup_city}, {request.pickup_state}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400">{"\uD83C\uDFC1"}</span>
            <span className="text-white font-medium">{request.dropoff_city}, {request.dropoff_state}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Distance</p>
          <p className="text-lg font-bold text-white">{formatDistance(request.distance_miles)}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 text-sm text-slate-400">
        <span>Rider: <span className="text-white">{request.rider?.full_name}</span></span>
        <span>|</span>
        <span>Suggested: <span className="text-green-400">{formatPrice(request.suggested_price)}</span></span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Your Price ($)</label>
          <input
            type="number"
            step="0.50"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">ETA (min)</label>
          <input
            type="number"
            min="0"
            value={eta}
            onChange={(e) => setEta(e.target.value)}
            placeholder="5"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Note</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional"
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleSubmit}
        disabled={submitting || !price}
        className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl shadow-lg transition-all disabled:opacity-50 text-sm"
      >
        {submitting ? "Sending..." : `Send Offer - ${formatPrice(price || 0)}`}
      </motion.button>
    </motion.div>
  );
}
