import { useState } from "react";
import { motion } from "framer-motion";
import LocationInput from "../common/LocationInput";
import TimeSelector from "../common/TimeSelector";
import { formatPrice, formatDistance } from "../../utils/formatters";

export default function RideRequestForm({ onSubmit, loading, onPickupChange, onDropoffChange }) {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);

  const handlePickup = (val) => { setPickup(val); onPickupChange?.(val); };
  const handleDropoff = (val) => { setDropoff(val); onDropoffChange?.(val); };
  const [timeData, setTimeData] = useState({
    timeType: "immediate",
    requestedTime: "",
    timeRangeStart: "",
    timeRangeEnd: "",
  });

  const distance = pickup && dropoff
    ? calculateDistance(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng)
    : null;

  const suggestedPrice = distance ? Math.max(distance * 0.5, 3.0) : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pickup || !dropoff) return;

    onSubmit({
      pickup_city: pickup.city,
      pickup_state: pickup.state,
      pickup_lat: pickup.lat,
      pickup_lng: pickup.lng,
      dropoff_city: dropoff.city,
      dropoff_state: dropoff.state,
      dropoff_lat: dropoff.lat,
      dropoff_lng: dropoff.lng,
      time_type: timeData.timeType,
      requested_time: timeData.requestedTime || null,
      time_range_start: timeData.timeRangeStart || null,
      time_range_end: timeData.timeRangeEnd || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <LocationInput
        label="Pickup Location"
        value={pickup}
        onChange={handlePickup}
        icon={"\uD83D\uDCCD"}
        placeholder="Where are you?"
      />

      <LocationInput
        label="Drop-off Location"
        value={dropoff}
        onChange={handleDropoff}
        icon={"\uD83C\uDFC1"}
        placeholder="Where are you going?"
      />

      {distance && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20 rounded-xl"
        >
          <div>
            <p className="text-sm text-slate-400">Estimated Distance</p>
            <p className="text-xl font-bold text-white">{formatDistance(distance)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-400">Suggested Price</p>
            <p className="text-xl font-bold text-green-400">{formatPrice(suggestedPrice)}</p>
          </div>
        </motion.div>
      )}

      <TimeSelector value={timeData} onChange={setTimeData} />

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={!pickup || !dropoff || loading}
        className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {loading ? "Requesting..." : "Request Ride"}
      </motion.button>
    </form>
  );
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
