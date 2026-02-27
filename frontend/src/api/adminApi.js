import api from "./axiosInstance";

export const getUsers = () => api.get("/admin/users/");
export const createUser = (data) => api.post("/admin/users/create/", data);
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}/`);
export const getOnlineUsers = () => api.get("/admin/online-users/");
export const getStats = () => api.get("/admin/stats/");
export const getAdminRides = () => api.get("/admin/rides/");
