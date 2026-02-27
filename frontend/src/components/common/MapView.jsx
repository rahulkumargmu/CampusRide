import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const pickupIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const dropoffIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ pickup, dropoff }) {
  const map = useMap();

  useEffect(() => {
    if (pickup && dropoff) {
      const bounds = L.latLngBounds(
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng]
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    } else if (pickup) {
      map.setView([pickup.lat, pickup.lng], 12);
    } else if (dropoff) {
      map.setView([dropoff.lat, dropoff.lng], 12);
    }
  }, [pickup, dropoff, map]);

  return null;
}

export default function MapView({ pickup, dropoff, className = "" }) {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    if (!pickup || !dropoff) {
      setRouteCoords([]);
      return;
    }

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}?overview=full&geometries=geojson`
        );
        const data = await res.json();
        if (data.routes?.[0]?.geometry) {
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
          setRouteCoords(coords);
        }
      } catch {
        setRouteCoords([]);
      }
    };
    fetchRoute();
  }, [pickup, dropoff]);

  const center = pickup
    ? [Number(pickup.lat), Number(pickup.lng)]
    : [39.8283, -98.5795]; // Center of US

  return (
    <div className={`rounded-2xl overflow-hidden border border-white/10 ${className}`}>
      <MapContainer
        center={center}
        zoom={pickup ? 12 : 4}
        className="h-full w-full"
        style={{ minHeight: "300px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds pickup={pickup} dropoff={dropoff} />
        {pickup && (
          <Marker position={[Number(pickup.lat), Number(pickup.lng)]} icon={pickupIcon}>
            <Popup>
              <strong>Pickup:</strong> {pickup.city}, {pickup.state}
            </Popup>
          </Marker>
        )}
        {dropoff && (
          <Marker position={[Number(dropoff.lat), Number(dropoff.lng)]} icon={dropoffIcon}>
            <Popup>
              <strong>Drop-off:</strong> {dropoff.city}, {dropoff.state}
            </Popup>
          </Marker>
        )}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: "#3b82f6", weight: 4, opacity: 0.8 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
