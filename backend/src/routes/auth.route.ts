import express from "express";
import passport from "passport";
import { googleCallback, logout } from "../controllers/auth.controller";
import { checkAuth } from "../middleware";

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

// Check auth status - DON'T use checkAuth middleware here
router.get("/checkAuth", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({
      user: req.user, // Passport attaches user from session
    });
  } else {
    res.status(401).json({
      message: "Not authenticated",
      user: null,
    });
  }
});

export default router;
