// authAPI.ts
import axiosInstance from "../../lib/axiosInstance";

// Make sure your axiosInstance has credentials enabled
// axiosInstance should be configured like this:
// const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000",
//   withCredentials: true, // CRUCIAL for session cookies
// });

export const checkAuth = async () => {
  const response = await axiosInstance.get("/auth/checkAuth");
  return response.data.user; // Extract user data, not the whole axios response
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