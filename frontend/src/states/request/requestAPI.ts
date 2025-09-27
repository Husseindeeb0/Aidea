import axiosInstance from "../../lib/axiosInstance";

export const sendRequestAPI = (data: {
  userId: string;
  categoryName?: string;
  itemName?: string;
}) => axiosInstance.post("/requests/send", data);
export const getRequestsAPI = () => axiosInstance.get("/requests/getRequests");
export const getRequestHistoryAPI = () =>
  axiosInstance.get("/requests/getAllRequestHistory");
export const checkExpirationAPI = () =>
  axiosInstance.get("/requests/checkExpiration");
export const getUserSubscriptionsAPI = () =>
  axiosInstance.get("/requests/getUserSubscriptions");
export const allowRequestAPI = (data: { userId: string; id: string }) =>
  axiosInstance.post("/requests/allowRequest", data);
export const rejectRequestAPI = (data: { userId: string; id: string }) =>
  axiosInstance.post("/requests/rejectRequest", data);
export const removeRequestAPI = (userId: string, requestId: string) =>
  axiosInstance.delete(`/requests/remove/${userId}/${requestId}`);
