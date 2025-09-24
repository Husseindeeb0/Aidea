import axiosInstance from "../../lib/axiosInstance";

export const sendRequestAPI = (data: {
  userId: string;
  categoryName: string;
  itemName: string;
}) => axiosInstance.post("/requests/send", data);

export const removeRequestAPI = (userId: string, requestId: string) =>
  axiosInstance.delete(`/requests/remove/${userId}/${requestId}`);
