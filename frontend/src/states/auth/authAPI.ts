import axiosInstance from "../../lib/axiosInstance";

export const checkAuth = async () => {
  const response = await axiosInstance.get("/auth/checkAuth");
  return response.data.user;
};

export const logout = async () => {
  const response = await axiosInstance.get("/auth/logout");
  localStorage.removeItem("isAuthenticated");
  return response.data;
};

export const loginWithGoogle = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  localStorage.setItem("isAuthenticated", "true");
};