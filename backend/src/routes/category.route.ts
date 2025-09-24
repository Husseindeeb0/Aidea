import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

const router = Router();

router.post("/createCategory", createCategory);
router.get("/getCategories", getCategories);
router.get("/getCategoryById/:id", getCategoryById);
router.patch("/updateCategory", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

export default router;
