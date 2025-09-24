import { createAsyncThunk } from "@reduxjs/toolkit";
import { checkAuth, logout } from "./authAPI";

export const checkAuthThunk = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      return await checkAuth();
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch user");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      return await logout();
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  }
);
