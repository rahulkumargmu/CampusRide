import { useState } from "react";
import { motion } from "framer-motion";

const timeOptions = [
  { value: "immediate", label: "Right Now", icon: "\u26A1" },
  { value: "specific", label: "Specific Time", icon: "\uD83D\uDD50" },
  { value: "range", label: "Time Range", icon: "\uD83D\uDCC5" },
];

export default function TimeSelector({ value, onChange }) {
  const { timeType, requestedTime, timeRangeStart, timeRangeEnd } = value;

  const handleTypeChange = (type) => {
    onChange({ ...value, timeType: type, requestedTime: "", timeRangeStart: "", timeRangeEnd: "" });
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">When do you need the ride?</label>
      <div className="grid grid-cols-3 gap-2">
        {timeOptions.map((opt) => (
          <motion.button
            key={opt.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => handleTypeChange(opt.value)}
            className={`py-3 px-3 rounded-xl text-sm font-medium border transition-all ${
              timeType === opt.value
                ? "bg-primary-500/20 border-primary-500/50 text-primary-300"
                : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
            }`}
          >
            <span className="block text-lg mb-1">{opt.icon}</span>
            {opt.label}
          </motion.button>
        ))}
      </div>

      {timeType === "specific" && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <input
            type="datetime-local"
            value={requestedTime}
            onChange={(e) => onChange({ ...value, requestedTime: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          />
        </motion.div>
      )}

      {timeType === "range" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <label className="block text-xs text-slate-400 mb-1">From</label>
            <input
              type="datetime-local"
              value={timeRangeStart}
              onChange={(e) => onChange({ ...value, timeRangeStart: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">To</label>
            <input
              type="datetime-local"
              value={timeRangeEnd}
              onChange={(e) => onChange({ ...value, timeRangeEnd: e.target.value })}
              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
