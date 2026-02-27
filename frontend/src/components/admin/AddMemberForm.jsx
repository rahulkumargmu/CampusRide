import { useState } from "react";
import { motion } from "framer-motion";

export default function AddMemberForm({ onAdd }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    role: "rider",
    password: "",
    password_confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.password_confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await onAdd(form);
      setForm({ full_name: "", email: "", phone_number: "", role: "rider", password: "", password_confirm: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const update = (k, v) => setForm({ ...form, [k]: v });

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-4"
    >
      <h3 className="text-lg font-semibold text-white">Add New Member</h3>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <input value={form.full_name} onChange={(e) => update("full_name", e.target.value)} placeholder="Full Name" required
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
        <input value={form.email} onChange={(e) => update("email", e.target.value)} type="email" placeholder="Email" required
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
        <input value={form.phone_number} onChange={(e) => update("phone_number", e.target.value)} placeholder="Phone" required
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
        <select value={form.role} onChange={(e) => update("role", e.target.value)}
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50">
          <option value="rider">Rider</option>
          <option value="driver">Driver</option>
        </select>
        <input value={form.password} onChange={(e) => update("password", e.target.value)} type="password" placeholder="Password" required minLength={8}
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
        <input value={form.password_confirm} onChange={(e) => update("password_confirm", e.target.value)} type="password" placeholder="Confirm Password" required
          className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
      </div>

      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading}
        className="w-full py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 text-sm">
        {loading ? "Adding..." : "Add Member"}
      </motion.button>
    </motion.form>
  );
}
