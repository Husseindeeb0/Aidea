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
router.get("/checkAuth", checkAuth, (req, res) => {
  res.json({
    user: req.user, // Passport attaches user from session
  });
});

export default router;
