import { Request, Response } from "express";
import User from "../models/User";

// POST /requests/send
export const sendRequest = async (req: Request, res: Response) => {
  try {
    const { userId, categoryName, itemName } = req.body;
    if (!userId || !categoryName || !itemName) {
      return res
        .status(400)
        .json({ message: "userId, categoryName and itemName are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.requests.push({
      categoryName,
      itemName,
      createdAt: new Date(),
    } as any);
    await user.save();

    return res
      .status(201)
      .json({ message: "Request sent", requests: user.requests });
  } catch (error: any) {
    console.error("Error sending request:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// DELETE /requests/remove/:userId/:requestId
export const removeRequest = async (req: Request, res: Response) => {
  try {
    const { userId, requestId } = req.params as {
      userId: string;
      requestId: string;
    };
    if (!userId || !requestId) {
      return res
        .status(400)
        .json({ message: "userId and requestId are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.requests = user.requests.filter(
      (r: any) => String(r._id) !== String(requestId)
    );
    await user.save();

    return res
      .status(200)
      .json({ message: "Request removed", requests: user.requests });
  } catch (error: any) {
    console.error("Error removing request:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
