import { Request, Response } from "express";

export const googleCallback = (req: Request, res: Response) => {
  res.redirect("http://localhost:5173/");
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
