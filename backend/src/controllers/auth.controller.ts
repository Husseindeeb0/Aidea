import { Request, Response } from "express";
import dotenv from "dotenv"

dotenv.config();

export const googleCallback = (req: Request, res: Response) => {
  const URI = process.env.FRONTEND_URI;
  if (!URI) {
    return res
      .status(500)
      .json({ message: "Server misconfiguration: missing frontend URI" });
  }
  res.redirect(`${URI}/`);
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Error logging out" });
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
};
