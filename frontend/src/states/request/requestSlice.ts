import { createSlice } from "@reduxjs/toolkit";
import {
  sendRequestThunk,
  removeRequestThunk,
  getRequestsThunk,
  getRequestsHistoryThunk,
  allowRequestThunk,
  rejectRequestThunk,
  checkEpirationThunk,
  getUserSubscriptionsThunk,
} from "./requestThunk";
import type { Request, RequestHistory, SubscriptionItem } from "../../types";

interface RequestsState {
  requests: Request[];
  requestsHistory: RequestHistory[];
  subscriptions: SubscriptionItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RequestsState = {
  requests: [],
  requestsHistory: [],
  subscriptions: [],
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
      .addCase(getRequestsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRequestsThunk.fulfilled, (state, action) => {
        state.requests = action.payload;
        state.isLoading = false;
      })
      .addCase(getRequestsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to send request";
      });

    builder
      .addCase(getRequestsHistoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRequestsHistoryThunk.fulfilled, (state, action) => {
        state.requestsHistory = action.payload;
        state.isLoading = false;
      })
      .addCase(getRequestsHistoryThunk.rejected, (state, action) => {
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

    builder
      .addCase(allowRequestThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(allowRequestThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(allowRequestThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to allow request";
      });

    builder
      .addCase(rejectRequestThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectRequestThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(rejectRequestThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to reject request";
      });

    builder
      .addCase(checkEpirationThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkEpirationThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(checkEpirationThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to check expirations";
      });

    builder
      .addCase(getUserSubscriptionsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserSubscriptionsThunk.fulfilled, (state, action) => {
        state.subscriptions = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserSubscriptionsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to check expirations";
      });
  },
});

export default requestsSlice.reducer;
