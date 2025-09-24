import axiosInstance from "../../lib/axiosInstance";

export const checkAuth = () => axiosInstance.get("/auth/checkAuth");
export const logout = () => axiosInstance.post("/auth/logout");