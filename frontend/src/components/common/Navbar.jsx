import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = {
    rider: [
      { to: "/rider", label: "Dashboard" },
      { to: "/rider/request", label: "Request Ride" },
      { to: "/rider/history", label: "History" },
    ],
    driver: [
      { to: "/driver", label: "Dashboard" },
      { to: "/driver/requests", label: "Ride Requests" },
      { to: "/driver/history", label: "History" },
    ],
    admin: [
      { to: "/admin", label: "Dashboard" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/rides", label: "Rides" },
    ],
  };

  const links = user ? navLinks[user.role] || [] : [];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? `/${user.role}` : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              CR
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              CampusRide
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.to
                    ? "bg-primary-500/20 text-primary-300"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <>
                <Link
                  to="/settings"
                  className="text-right hidden sm:block hover:opacity-75 transition-opacity"
                >
                  <p className="text-sm font-medium text-slate-200">{user.full_name}</p>
                  <p className="text-xs text-slate-400 capitalize">{user.role}</p>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  Logout
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
