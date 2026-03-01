import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    role: "rider",
    password: "",
    password_confirm: "",
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_color: "",
    license_plate: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password_confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form };
      if (payload.vehicle_year === "") payload.vehicle_year = null;
      else if (payload.vehicle_year) payload.vehicle_year = parseInt(payload.vehicle_year, 10);

      const user = await register(payload);
      navigate(`/${user.role}`);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.values(data).flat();
        setError(messages.join(" "));
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Role Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">I am a</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "rider", label: "Rider", desc: "I need rides", icon: "🚗" },
            { value: "driver", label: "Driver", desc: "I give rides", icon: "🚘" },
          ].map((role) => (
            <motion.button
              key={role.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => update("role", role.value)}
              className={`p-4 rounded-xl border text-center transition-all ${
                form.role === role.value
                  ? "bg-primary-500/20 border-primary-500/50 text-white"
                  : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20"
              }`}
            >
              <span className="text-2xl block mb-1">{role.icon}</span>
              <span className="font-medium text-sm">{role.label}</span>
              <span className="block text-xs text-slate-500 mt-0.5">{role.desc}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
        <input
          type="text"
          required
          value={form.full_name}
          onChange={(e) => update("full_name", e.target.value)}
          className={inputClass}
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className={inputClass}
          placeholder="john@university.edu"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
        <input
          type="tel"
          required
          value={form.phone_number}
          onChange={(e) => update("phone_number", e.target.value)}
          className={inputClass}
          placeholder="(555) 123-4567"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className={inputClass}
            placeholder="Min 8 chars"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirm</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password_confirm}
            onChange={(e) => update("password_confirm", e.target.value)}
            className={inputClass}
            placeholder="Re-enter"
          />
        </div>
      </div>

      {/* Vehicle Details - drivers only */}
      <AnimatePresence>
        {form.role === "driver" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2 space-y-3">
              <p className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <span>🚘</span> Vehicle Details
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Make</label>
                  <input
                    type="text"
                    value={form.vehicle_make}
                    onChange={(e) => update("vehicle_make", e.target.value)}
                    className={inputClass}
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Model</label>
                  <input
                    type="text"
                    value={form.vehicle_model}
                    onChange={(e) => update("vehicle_model", e.target.value)}
                    className={inputClass}
                    placeholder="Camry"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Year</label>
                  <input
                    type="number"
                    value={form.vehicle_year}
                    onChange={(e) => update("vehicle_year", e.target.value)}
                    className={inputClass}
                    placeholder="2022"
                    min="1990"
                    max="2030"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Color</label>
                  <input
                    type="text"
                    value={form.vehicle_color}
                    onChange={(e) => update("vehicle_color", e.target.value)}
                    className={inputClass}
                    placeholder="Silver"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">License Plate</label>
                <input
                  type="text"
                  value={form.license_plate}
                  onChange={(e) => update("license_plate", e.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder="ABC 1234"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create Account"}
      </motion.button>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
          Sign in
        </Link>
      </p>
    </motion.form>
  );
}
