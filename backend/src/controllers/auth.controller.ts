import { Request, Response } from "express";

export const googleCallback = (req: Request, res: Response) => {
  // req.user is the saved MongoDB user
  console.log("Logged in user:", req.user);

  // TODO: If you want JWT instead of session, generate token here
  res.redirect("http://localhost:3000/");
};

export const logout = (req: Request, res: Response) => {
  req.logout(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Error logging out" });
    }

    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // session cookie name (default from express-session)
      res.redirect("http://localhost:3000/"); // frontend homepage
    });
  });
};