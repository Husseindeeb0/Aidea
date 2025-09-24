import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
} from "./categoryAPI";
import type { Category } from "../../types";
import { AxiosError } from "axios";

export const createCategoryThunk = createAsyncThunk(
  "/categories/createCategoryThunk",
  async (newCategory: Category, thunkAPI) => {
    try {
      const res = await createCategory(newCategory);
      return res.data;
    } catch (error: unknown) {
      console.error("Error in add category thunk:", error);

      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          return thunkAPI.rejectWithValue(error.response.data.message);
        }
        return thunkAPI.rejectWithValue(
          error.message || "Axios error occurred"
        );
      }

      // fallback for any other unexpected error
      return thunkAPI.rejectWithValue(
        "Add category thunk failed due to unknown error"
      );
    }
  }
);

export const updateCategoryThunk = createAsyncThunk(
  "/categories/updateCategoryThunk",
  async (updatedCategory: Category, thunkAPI) => {
    try {
      const res = await updateCategory(updatedCategory);
      return res.data;
    } catch (error: unknown) {
      console.error("Error in update category thunk:", error);

      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          return thunkAPI.rejectWithValue(error.response.data.message);
        }
        return thunkAPI.rejectWithValue(
          error.message || "Axios error occurred"
        );
      }

      return thunkAPI.rejectWithValue(
        "Update category thunk failed due to unknown error"
      );
    }
  }
);

export const deleteCategoryThunk = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>("/categories/deleteCategory", async (id, thunkAPI) => {
  try {
    const res = await deleteCategory(id);
    return res.data;
  } catch (error: unknown) {
    console.error("Error in delete category thunk:", error);

    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(error.message || "Axios error occurred");
    }

    return thunkAPI.rejectWithValue(
      "Delete category thunk failed due to unknown error"
    );
  }
});

export const getCategoriesThunk = createAsyncThunk(
  "/categories/getCategories",
  async (_, thunkAPI) => {
    try {
      const res = await getCategories();
      return res.data.categoriesData;
    } catch (error: unknown) {
      console.error("Error in get categories thunk:", error);

      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          return thunkAPI.rejectWithValue(error.response.data.message);
        }
        return thunkAPI.rejectWithValue(
          error.message || "Axios error occurred"
        );
      }

      return thunkAPI.rejectWithValue(
        "Get categories thunk failed due to unknown error"
      );
    }
  }
);

export const getCategoryByIdThunk = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>("/categories/getCategoryById", async (id, thunkAPI) => {
  try {
    const res = await getCategoryById(id);
    return res.data.categoryData;
  } catch (error: unknown) {
    console.error("Error in get category by id thunk:", error);

    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(error.message || "Axios error occurred");
    }

    return thunkAPI.rejectWithValue(
      "Get category by id thunk failed due to unknown error"
    );
  }
});
