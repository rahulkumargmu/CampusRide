import { Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RiderDashboard from "./pages/rider/RiderDashboard";
import RequestRidePage from "./pages/rider/RequestRidePage";
import RideOffersPage from "./pages/rider/RideOffersPage";
import RiderHistoryPage from "./pages/rider/RiderHistoryPage";
import DriverDashboard from "./pages/driver/DriverDashboard";
import IncomingRequestsPage from "./pages/driver/IncomingRequestsPage";
import DriverHistoryPage from "./pages/driver/DriverHistoryPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import MonitorRidesPage from "./pages/admin/MonitorRidesPage";
import SettingsPage from "./pages/SettingsPage";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public */}
        <Route path="/" element={user ? <Navigate to={`/${user.role}`} /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to={`/${user.role}`} /> : <RegisterPage />} />

        {/* Rider */}
        <Route element={<ProtectedRoute role="rider" />}>
          <Route path="/rider" element={<RiderDashboard />} />
          <Route path="/rider/request" element={<RequestRidePage />} />
          <Route path="/rider/offers/:requestId" element={<RideOffersPage />} />
          <Route path="/rider/history" element={<RiderHistoryPage />} />
        </Route>

        {/* Driver */}
        <Route element={<ProtectedRoute role="driver" />}>
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/driver/requests" element={<IncomingRequestsPage />} />
          <Route path="/driver/history" element={<DriverHistoryPage />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsersPage />} />
          <Route path="/admin/rides" element={<MonitorRidesPage />} />
        </Route>

        {/* Settings - all authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
