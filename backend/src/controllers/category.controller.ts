import { Request, Response } from "express";
import { Category } from "../models/Category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, rank, price } = req.body;
    if (!name || !description || !rank) {
      return res
        .status(400)
        .json({ message: "Name, description and rank are required" });
    }

    const category = new Category({ name, description, rank, price });
    await category.save();

    res.status(201).json(category);
  } catch (error: any) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ rank: 1 });
    res.status(200).json({ categoriesData: categories });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, rank, items, price, _id } = req.body;

    const update: Record<string, unknown> = { name, description, rank, price };
    if (Array.isArray(items)) {
      update.items = items;
    }

    const category = await Category.findByIdAndUpdate(_id, update, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error: any) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
