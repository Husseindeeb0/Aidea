import { createSlice } from "@reduxjs/toolkit";
import { checkAuthThunk, logoutThunk } from "./authThunks";
import type { AuthProps } from "../../types";

const initialState: AuthProps = {
  userData: null,
  isAuthenticating: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch userData
      .addCase(checkAuthThunk.pending, (state) => {
        state.isAuthenticating = true;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.userData = action.payload;
      })
      .addCase(checkAuthThunk.rejected, (state, action) => {
        state.isAuthenticating = false;
        state.error = action.payload as string;
      })

    builder
      // Logout
      .addCase(logoutThunk.pending, (state) => {
        state.isAuthenticating = true;
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.userData = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isAuthenticating = false;
        state.error = action.payload as string;
      })
      
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;