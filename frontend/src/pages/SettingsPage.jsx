import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/common/Navbar";
import AnimatedPage from "../components/common/AnimatedPage";
import { useAuth } from "../context/AuthContext";
import { updateProfile, getDriverProfile, updateDriverProfile } from "../api/authApi";

export default function SettingsPage() {
  const { user, refreshProfile } = useAuth();

  // Personal info state
  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || "",
    phone_number: user?.phone_number || "",
    password: "",
    password_confirm: "",
  });
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");

  // Vehicle state (drivers only)
  const [vehicleForm, setVehicleForm] = useState({
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_color: "",
    license_plate: "",
  });
  const [vehicleEditing, setVehicleEditing] = useState(false);
  const [vehicleSaving, setVehicleSaving] = useState(false);
  const [vehicleError, setVehicleError] = useState("");
  const [vehicleSuccess, setVehicleSuccess] = useState("");

  useEffect(() => {
    if (user?.role === "driver") {
      getDriverProfile()
        .then((r) => {
          const p = r.data;
          setVehicleForm({
            vehicle_make: p.vehicle_make || "",
            vehicle_model: p.vehicle_model || "",
            vehicle_year: p.vehicle_year || "",
            vehicle_color: p.vehicle_color || "",
            license_plate: p.license_plate || "",
          });
        })
        .catch(() => {});
    }
  }, [user?.role]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (profileForm.password && profileForm.password !== profileForm.password_confirm) {
      setProfileError("Passwords do not match");
      return;
    }

    setProfileSaving(true);
    try {
      const payload = {
        full_name: profileForm.full_name,
        phone_number: profileForm.phone_number,
      };
      if (profileForm.password) {
        payload.password = profileForm.password;
        payload.password_confirm = profileForm.password_confirm;
      }

      await updateProfile(payload);
      await refreshProfile();
      setProfileForm((f) => ({ ...f, password: "", password_confirm: "" }));
      setProfileEditing(false);
      setProfileSuccess("Profile updated successfully");
      setTimeout(() => setProfileSuccess(""), 3000);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        setProfileError(Object.values(data).flat().join(" "));
      } else {
        setProfileError("Failed to save. Please try again.");
      }
    } finally {
      setProfileSaving(false);
    }
  };

  const handleProfileCancel = () => {
    setProfileForm({
      full_name: user?.full_name || "",
      phone_number: user?.phone_number || "",
      password: "",
      password_confirm: "",
    });
    setProfileEditing(false);
    setProfileError("");
  };

  const handleVehicleSave = async (e) => {
    e.preventDefault();
    setVehicleError("");
    setVehicleSuccess("");

    setVehicleSaving(true);
    try {
      const payload = {
        ...vehicleForm,
        vehicle_year: vehicleForm.vehicle_year ? parseInt(vehicleForm.vehicle_year, 10) : null,
      };
      await updateDriverProfile(payload);
      setVehicleEditing(false);
      setVehicleSuccess("Vehicle details updated");
      setTimeout(() => setVehicleSuccess(""), 3000);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        setVehicleError(Object.values(data).flat().join(" "));
      } else {
        setVehicleError("Failed to save. Please try again.");
      }
    } finally {
      setVehicleSaving(false);
    }
  };

  const inputClass = (editing) =>
    `w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all ${
      editing ? "border-white/20" : "border-transparent opacity-75 cursor-default"
    }`;

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        {/* Personal Info Section */}
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Personal Info</h2>
            {!profileEditing ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setProfileEditing(true)}
                className="px-4 py-1.5 text-sm font-medium text-primary-300 border border-primary-500/30 rounded-lg hover:bg-primary-500/10 transition-all"
              >
                Edit
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleProfileCancel}
                  className="px-4 py-1.5 text-sm font-medium text-slate-400 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  form="profile-form"
                  type="submit"
                  disabled={profileSaving}
                  className="px-4 py-1.5 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50"
                >
                  {profileSaving ? "Saving..." : "Save"}
                </motion.button>
              </div>
            )}
          </div>

          {profileError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-sm"
            >
              {profileSuccess}
            </motion.div>
          )}

          <form id="profile-form" onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                readOnly={!profileEditing}
                value={profileForm.full_name}
                onChange={(e) => setProfileForm((f) => ({ ...f, full_name: e.target.value }))}
                className={inputClass(profileEditing)}
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Email</label>
              <input
                type="email"
                readOnly
                value={user?.email || ""}
                className="w-full px-4 py-3 bg-white/5 border border-transparent rounded-xl text-slate-400 opacity-75 cursor-default"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Phone Number</label>
              <input
                type="tel"
                required
                readOnly={!profileEditing}
                value={profileForm.phone_number}
                onChange={(e) => setProfileForm((f) => ({ ...f, phone_number: e.target.value }))}
                className={inputClass(profileEditing)}
              />
            </div>

            {profileEditing && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3 pt-2 border-t border-white/10"
              >
                <p className="text-xs text-slate-400">Change Password (leave blank to keep current)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">New Password</label>
                    <input
                      type="password"
                      minLength={8}
                      value={profileForm.password}
                      onChange={(e) => setProfileForm((f) => ({ ...f, password: e.target.value }))}
                      className={inputClass(true)}
                      placeholder="Min 8 chars"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Confirm</label>
                    <input
                      type="password"
                      value={profileForm.password_confirm}
                      onChange={(e) => setProfileForm((f) => ({ ...f, password_confirm: e.target.value }))}
                      className={inputClass(true)}
                      placeholder="Re-enter"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Vehicle Details - drivers only */}
        {user?.role === "driver" && (
          <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-white">Vehicle Details</h2>
              {!vehicleEditing ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setVehicleEditing(true)}
                  className="px-4 py-1.5 text-sm font-medium text-primary-300 border border-primary-500/30 rounded-lg hover:bg-primary-500/10 transition-all"
                >
                  Edit
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => { setVehicleEditing(false); setVehicleError(""); }}
                    className="px-4 py-1.5 text-sm font-medium text-slate-400 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    form="vehicle-form"
                    type="submit"
                    disabled={vehicleSaving}
                    className="px-4 py-1.5 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all disabled:opacity-50"
                  >
                    {vehicleSaving ? "Saving..." : "Save"}
                  </motion.button>
                </div>
              )}
            </div>

            {vehicleError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
                {vehicleError}
              </div>
            )}
            {vehicleSuccess && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-sm"
              >
                {vehicleSuccess}
              </motion.div>
            )}

            <form id="vehicle-form" onSubmit={handleVehicleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Make</label>
                  <input
                    type="text"
                    readOnly={!vehicleEditing}
                    value={vehicleForm.vehicle_make}
                    onChange={(e) => setVehicleForm((f) => ({ ...f, vehicle_make: e.target.value }))}
                    className={inputClass(vehicleEditing)}
                    placeholder="Toyota"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Model</label>
                  <input
                    type="text"
                    readOnly={!vehicleEditing}
                    value={vehicleForm.vehicle_model}
                    onChange={(e) => setVehicleForm((f) => ({ ...f, vehicle_model: e.target.value }))}
                    className={inputClass(vehicleEditing)}
                    placeholder="Camry"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Year</label>
                  <input
                    type="number"
                    readOnly={!vehicleEditing}
                    value={vehicleForm.vehicle_year}
                    onChange={(e) => setVehicleForm((f) => ({ ...f, vehicle_year: e.target.value }))}
                    className={inputClass(vehicleEditing)}
                    placeholder="2022"
                    min="1990"
                    max="2030"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Color</label>
                  <input
                    type="text"
                    readOnly={!vehicleEditing}
                    value={vehicleForm.vehicle_color}
                    onChange={(e) => setVehicleForm((f) => ({ ...f, vehicle_color: e.target.value }))}
                    className={inputClass(vehicleEditing)}
                    placeholder="Silver"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">License Plate</label>
                <input
                  type="text"
                  readOnly={!vehicleEditing}
                  value={vehicleForm.license_plate}
                  onChange={(e) => setVehicleForm((f) => ({ ...f, license_plate: e.target.value.toUpperCase() }))}
                  className={inputClass(vehicleEditing)}
                  placeholder="ABC 1234"
                />
              </div>
            </form>
          </div>
        )}
      </AnimatedPage>
    </>
  );
}
