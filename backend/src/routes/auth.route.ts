import express from "express";
import passport from "passport";
import { googleCallback, logout } from "../controllers/auth.controller";
import User from "../models/User";

const router = express.Router();

// Start Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleCallback
);

// Logout
router.get("/logout", logout);

router.get("/checkAuth", async (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    try {
      const user = await User.findById((req.user as any)._id)
        .populate("allowedCategories.categoryId")
        .populate("allowedItems.itemId");

      res.json({ user });
    } catch (error) {
      console.error("Error populating user:", error);
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  } else {
    res.status(401).json({ message: "Not authenticated", user: null });
  }
});

export default router;
