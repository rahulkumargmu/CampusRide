import { motion } from "framer-motion";
import { formatPrice } from "../../utils/formatters";
import { listItem } from "../../styles/animations";
import StarRating from "../common/StarRating";

export default function DriverOfferCard({ offer, onAccept, isAccepting }) {
  return (
    <motion.div
      variants={listItem}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-primary-500/30 transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-500 rounded-full flex items-center justify-center text-white font-bold">
              {offer.driver?.full_name?.[0] || "D"}
            </div>
            <div>
              <h4 className="font-semibold text-white">{offer.driver?.full_name}</h4>
              <StarRating rating={offer.driver_rating || 5} size="sm" />
            </div>
          </div>

          {offer.driver_vehicle && (
            <p className="text-sm text-slate-400 mb-1">{offer.driver_vehicle}</p>
          )}

          {offer.estimated_arrival_minutes > 0 && (
            <p className="text-sm text-slate-400">
              ETA: <span className="text-white">{offer.estimated_arrival_minutes} min</span>
            </p>
          )}

          {offer.message && (
            <p className="text-sm text-slate-500 italic mt-1">"{offer.message}"</p>
          )}
        </div>

        <div className="text-right ml-4">
          <p className="text-3xl font-bold text-green-400">{formatPrice(offer.price)}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAccept(offer.id)}
            disabled={isAccepting}
            className="mt-3 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all disabled:opacity-50 text-sm"
          >
            {isAccepting ? "..." : "Accept"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
