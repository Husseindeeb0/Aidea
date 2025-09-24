import axiosInstance from "../../lib/axiosInstance";
import type { Category } from "../../types";

export const createCategory = (newCategory: Category) =>
  axiosInstance.post("/categories/createCategory", { newCategory });
export const updateCategory = (updatedCategory: Category) =>
  axiosInstance.patch("/categories/updateCategory", {
    updatedCategory,
  });
export const deleteCategory = (id: string) =>
  axiosInstance.delete(`/categories/deleteCategory/${id}`);
export const getCategories = () =>
  axiosInstance.get("/categories/getCategory");
export const getCategoryById = (id: string) =>
  axiosInstance.get(`/categories/getCategoryById/${id}`);
