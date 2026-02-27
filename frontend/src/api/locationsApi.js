import api from "./axiosInstance";

export const searchCities = async (query) => {
  const { data } = await api.get(`/locations/autocomplete/?q=${encodeURIComponent(query)}`);
  return data;
};

export const getDistance = async (fromLat, fromLng, toLat, toLng) => {
  const { data } = await api.get(
    `/locations/distance/?from_lat=${fromLat}&from_lng=${fromLng}&to_lat=${toLat}&to_lng=${toLng}`
  );
  return data;
};
