import { Request, Response, NextFunction } from "express";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // Not authenticated → redirect to login or return 401
  res.status(401).json({ message: "Unauthorized. Please log in with Google." });
}
