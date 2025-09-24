import { createSlice } from "@reduxjs/toolkit";
import { sendRequestThunk, removeRequestThunk } from "./requestThunk";

interface RequestsState {
  isLoading: boolean;
  error: string | null;
}

const initialState: RequestsState = {
  isLoading: false,
  error: null,
};

const requestsSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendRequestThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendRequestThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendRequestThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to send request";
      });

    builder
      .addCase(removeRequestThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeRequestThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(removeRequestThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to remove request";
      });
  },
});

export default requestsSlice.reducer;
