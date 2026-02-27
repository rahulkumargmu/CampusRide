import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocationAutocomplete } from "../../hooks/useLocationAutocomplete";

export default function LocationInput({ label, value, onChange, icon, placeholder }) {
  const { query, setQuery, results, isLoading } = useLocationAutocomplete();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onChange({
      city: city.city,
      state: city.state,
      lat: city.latitude,
      lng: city.longitude,
      display: `${city.city}, ${city.state}`,
    });
    setQuery(`${city.city}, ${city.state}`);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">{icon}</span>
        <input
          type="text"
          value={value?.display || query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (!e.target.value) onChange(null);
          }}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-primary-400/30 border-t-primary-400 rounded-full"
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 w-full mt-1 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
          >
            {results.map((city) => (
              <motion.li
                key={`${city.city}-${city.state}`}
                whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                onClick={() => handleSelect(city)}
                className="px-4 py-3 cursor-pointer flex items-center justify-between border-b border-white/5 last:border-b-0"
              >
                <div>
                  <span className="text-white font-medium">{city.city}</span>
                  <span className="text-slate-400">, {city.state_name}</span>
                </div>
                <span className="text-xs text-slate-500">{city.state}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
