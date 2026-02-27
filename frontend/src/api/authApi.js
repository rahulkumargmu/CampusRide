import api from "./axiosInstance";

export const registerUser = (data) => api.post("/auth/register/", data);
export const loginUser = (data) => api.post("/auth/login/", data);
export const logoutUser = (refresh) => api.post("/auth/logout/", { refresh });
export const refreshToken = (refresh) => api.post("/auth/token/refresh/", { refresh });
export const getProfile = () => api.get("/auth/profile/");
export const updateProfile = (data) => api.patch("/auth/profile/", data);
export const getDriverProfile = () => api.get("/auth/driver-profile/");
export const updateDriverProfile = (data) => api.patch("/auth/driver-profile/", data);
