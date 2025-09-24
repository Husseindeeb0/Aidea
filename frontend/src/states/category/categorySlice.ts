import { createSlice } from "@reduxjs/toolkit";
import {
  createCategoryThunk,
  getCategoriesThunk,
  updateCategoryThunk,
  deleteCategoryThunk,
  getCategoryByIdThunk,
} from "./categoryThunks";
import type { CategoryProps } from "../../types";

const initialState: CategoryProps = {
  categoryData: null,
  isLoading: false,
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
      // Add Category
      .addCase(createCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCategoryThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      // Get Categories
      .addCase(getCategoriesThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryData = action.payload;
      })
      .addCase(getCategoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      // Update Categories
      .addCase(updateCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCategoryThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const updated = action.payload as unknown as {
          _id?: string;
          id?: string;
        } | null;
        if (
          state.categoryData &&
          Array.isArray(state.categoryData) &&
          updated &&
          (updated._id || (updated as any).id)
        ) {
          const updatedId = (updated as any)._id ?? (updated as any).id;
          state.categoryData = state.categoryData.map((cat: any) =>
            (cat?._id ?? cat?.id) === updatedId ? { ...cat, ...updated } : cat
          );
        }
      })
      .addCase(updateCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      // Delete Category
      .addCase(deleteCategoryThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCategoryThunk.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteCategoryThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown Error";
      });

    builder
      // Get Category By ID
      .addCase(getCategoryByIdThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategoryByIdThunk.fulfilled, (state) => {
        state.isLoading = false;
        // state.categoryById = action.payload;
      })
      .addCase(getCategoryByIdThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Unknown Error";
      });
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
