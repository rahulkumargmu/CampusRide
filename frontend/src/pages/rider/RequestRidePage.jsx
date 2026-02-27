import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import AnimatedPage from "../../components/common/AnimatedPage";
import RideRequestForm from "../../components/rider/RideRequestForm";
import MapView from "../../components/common/MapView";
import { createRideRequest } from "../../api/ridesApi";

export default function RequestRidePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    setError("");
    setLoading(true);
    try {
      const { data: ride } = await createRideRequest(data);
      navigate(`/rider/offers/${ride.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create ride request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <AnimatedPage className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Request a Ride</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <RideRequestForm
              onSubmit={handleSubmit}
              loading={loading}
              onPickupChange={setPickup}
              onDropoffChange={setDropoff}
            />
          </div>
          <div className="h-[500px]">
            <MapView pickup={pickup} dropoff={dropoff} className="h-full" />
          </div>
        </div>
      </AnimatedPage>
    </>
  );
}
