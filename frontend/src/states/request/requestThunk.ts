import { createAsyncThunk } from "@reduxjs/toolkit";
import { sendRequestAPI, removeRequestAPI, getRequestsAPI } from "./requestAPI";

export const sendRequestThunk = createAsyncThunk(
  "/requests/send",
  async (
    data: { userId: string; categoryName: string; itemName?: string },
    thunkAPI
  ) => {
    try {
      const res = await sendRequestAPI(data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to send request"
      );
    }
  }
);

export const getRequestsThunk = createAsyncThunk(
  "/requests/getRequests",
  async (_, thunkAPI) => {
    try {
      const res = await getRequestsAPI();
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to get requests"
      );
    }
  }
);

export const removeRequestThunk = createAsyncThunk(
  "/requests/remove",
  async (data: { userId: string; requestId: string }, thunkAPI) => {
    try {
      const res = await removeRequestAPI(data.userId, data.requestId);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to remove request"
      );
    }
  }
);
