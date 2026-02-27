import api from "./axiosInstance";

export const createRideRequest = (data) => api.post("/rides/request/", data);
export const listRideRequests = () => api.get("/rides/requests/");
export const getRideRequest = (id) => api.get(`/rides/request/${id}/`);
export const cancelRideRequest = (id) => api.patch(`/rides/request/${id}/update/`, { status: "cancelled" });
export const createRideOffer = (data) => api.post("/rides/offer/", data);
export const listRideOffers = (rideRequestId) => api.get(`/rides/offers/?ride_request=${rideRequestId}`);
export const acceptOffer = (offerId) => api.post("/rides/accept-offer/", { offer_id: offerId });
export const completeRide = (id) => api.post(`/rides/complete/${id}/`);
export const getRideHistory = () => api.get("/rides/history/");
export const getActiveRide = () => api.get("/rides/active/");
