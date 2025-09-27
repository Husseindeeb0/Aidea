import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  sendRequestAPI,
  removeRequestAPI,
  getRequestsAPI,
  getRequestHistoryAPI,
  allowRequestAPI,
  rejectRequestAPI,
  checkExpirationAPI,
  getUserSubscriptionsAPI,
} from "./requestAPI";

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

export const getRequestsHistoryThunk = createAsyncThunk(
  "/requests/getRequestsHistory",
  async (_, thunkAPI) => {
    try {
      const res = await getRequestHistoryAPI();
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

export const allowRequestThunk = createAsyncThunk(
  "/requests/allowRequest",
  async (data: { userId: string; id: string }, thunkAPI) => {
    try {
      const res = await allowRequestAPI(data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to allow request"
      );
    }
  }
);

export const rejectRequestThunk = createAsyncThunk(
  "/requests/rejectRequest",
  async (data: { userId: string; id: string }, thunkAPI) => {
    try {
      const res = await rejectRequestAPI(data);
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to allow request"
      );
    }
  }
);

export const checkEpirationThunk = createAsyncThunk(
  "/requests/checkExpiration",
  async (_, thunkAPI) => {
    try {
      const res = await checkExpirationAPI();
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to check expirations"
      );
    }
  }
);


export const getUserSubscriptionsThunk = createAsyncThunk(
  "/requests/getUserSubscriptions",
  async (_, thunkAPI) => {
    try {
      const res = await getUserSubscriptionsAPI();
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to check expirations"
      );
    }
  }
);