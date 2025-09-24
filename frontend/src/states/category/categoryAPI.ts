import axiosInstance from "../../lib/axiosInstance";
import type { Category } from "../../types";

export const createCategory = (newCategory: Category) =>
  axiosInstance.post("/categories/createCategory", {
    name: newCategory.name,
    description: newCategory.description,
    rank: newCategory.ranking,
  });
export const updateCategory = (updatedCategory: Category) =>
  axiosInstance.patch("/categories/updateCategory", {
    _id:
      (updatedCategory as unknown as { _id?: string; id?: string })._id ||
      (updatedCategory as unknown as { id?: string }).id,
    name: updatedCategory.name,
    description: updatedCategory.description,
    rank: updatedCategory.ranking,
    // Forward nested items if present (used by ItemsPanel updates)
    ...((updatedCategory as unknown as { items?: unknown[] }).items
      ? { items: (updatedCategory as unknown as { items?: unknown[] }).items }
      : {}),
  });
export const deleteCategory = (id: string) =>
  axiosInstance.delete(`/categories/deleteCategory/${id}`);
export const getCategories = () =>
  axiosInstance.get("/categories/getCategories");
export const getCategoryById = (id: string) =>
  axiosInstance.get(`/categories/getCategoryById/${id}`);
