import { AnimatePresence, motion } from "framer-motion";
import DriverOfferCard from "./DriverOfferCard";
import { staggerContainer } from "../../styles/animations";

export default function DriverOffersList({ offers, onAccept, isAccepting }) {
  const sorted = [...offers].sort((a, b) => Number(a.price) - Number(b.price));

  if (sorted.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl mb-4"
        >
          {"\uD83D\uDD0D"}
        </motion.div>
        <p className="text-slate-400 text-lg">Waiting for drivers to send offers...</p>
        <p className="text-slate-500 text-sm mt-1">This usually takes a minute or two</p>
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-white">
          {sorted.length} Driver{sorted.length !== 1 ? "s" : ""} Available
        </h3>
        <span className="text-xs text-slate-500">Sorted by cheapest</span>
      </div>
      <AnimatePresence mode="popLayout">
        {sorted.map((offer) => (
          <DriverOfferCard
            key={offer.id}
            offer={offer}
            onAccept={onAccept}
            isAccepting={isAccepting}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
