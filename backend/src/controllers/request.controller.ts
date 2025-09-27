import { Request, Response } from "express";
import User from "../models/User";
import { IAllowedCategory, IAllowedItem } from "../models/User";
import { Category, Item } from "../models/Category";
import RequestHistory from "../models/RequestsHistory";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string;
    _id?: string;
    email?: string;
    name?: string;
    role?: string;
    [key: string]: any;
  };
}

// POST /requests/send
export const sendRequest = async (req: Request, res: Response) => {
  try {
    const { userId, categoryName, itemName } = req.body;
    console.log("Data: ", req.body);
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
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

export const getAllUserRequests = async (_req: Request, res: Response) => {
  try {
    const requests = await User.aggregate([
      { $unwind: "$requests" },
      {
        $project: {
          userId: "$_id",
          userName: "$name",
          userEmail: "$email",
          id: "$requests._id",
          categoryName: "$requests.categoryName",
          itemName: "$requests.itemName",
          createdAt: "$requests.createdAt",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json(requests);
  } catch (error: any) {
    console.error("Error fetching requests:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: error.message });
  }
};
export const allowRequest = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.body;
    if (!userId || !id) {
      return res
        .status(400)
        .json({ message: "userId and requestId are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const request = user.requests.find((r) => r._id?.toString() === id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    const expiredDate = new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    );

    // Handle item request
    if (request.itemName && request.categoryName) {
      console.log(request);
      const category = await Category.findOne({ name: request.categoryName });
      if (!category) {
        return res
          .status(404)
          .json({ message: "Category not found in database" });
      }

      // Step 2: find the item inside the category.items array
      const item = category.items.find(
        (i: any) => i.title === request.itemName
      );
      if (!item) {
        return res
          .status(404)
          .json({ message: "Item not found in this category" });
      }

      if (!user.allowedItems) user.allowedItems = [];

      // Check if item already allowed
      const isAlreadyAllowed = user.allowedItems.some(
        (ai) => ai.itemId && ai.itemId.toString() === item._id!.toString()
      );

      if (!isAlreadyAllowed) {
        // Simple assignment since interface now accepts string | ObjectId
        const newAllowedItem: IAllowedItem = {
          itemId: item._id! as mongoose.Types.ObjectId,
          expiredDate,
        };

        user.allowedItems.push({
          categoryId: category._id as mongoose.Types.ObjectId,
          itemId: item._id as mongoose.Types.ObjectId, // subdoc id from category.items
          expiredDate,
        });
      }
    }
    // Handle category request
    else if (request.categoryName) {
      // Find the actual category by name
      const category = await Category.findOne({ name: request.categoryName });
      if (!category) {
        return res
          .status(404)
          .json({ message: "Category not found in database" });
      }

      if (!user.allowedCategories) user.allowedCategories = [];

      // Check if category already allowed
      const isAlreadyAllowed = user.allowedCategories.some(
        (ac) => ac.categoryId.toString() === category._id!.toString()
      );

      if (!isAlreadyAllowed) {
        // Simple assignment since interface now accepts string | ObjectId
        const newAllowedCategory: IAllowedCategory = {
          categoryId: category._id! as mongoose.Types.ObjectId,
          expiredDate,
        };

        user.allowedCategories.push(newAllowedCategory);
      }
    }

    // Save to request history
    const history = new RequestHistory({
      userName: user.name,
      userEmail: user.email,
      categoryName: request.categoryName,
      itemName: request.itemName || "",
      createdAt: request.createdAt,
      processedAt: new Date(),
      expiredDate,
      state: "accepted",
    });
    await history.save();

    // Remove request and save user
    await User.findByIdAndUpdate(userId, {
      $pull: { requests: { _id: id } },
      $set: {
        allowedCategories: user.allowedCategories,
        allowedItems: user.allowedItems,
      },
    });

    return res.status(200).json({
      message: "Request approved and logged in history",
      allowedCategories: user.allowedCategories,
      allowedItems: user.allowedItems,
    });
  } catch (error: any) {
    console.error("Error approving request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const rejectRequest = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.body;

    if (!userId || !id) {
      return res
        .status(400)
        .json({ message: "userId and requestId are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const request = user.requests.find((req) => req._id?.toString() === id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // --- Save rejection in request history ---
    const history = new RequestHistory({
      userName: user.name,
      userEmail: user.email,
      categoryName: request.categoryName,
      itemName: request.itemName || "",
      createdAt: request.createdAt,
      processedAt: new Date(),
      expiredDate: new Date(),
      state: "rejected",
    });
    await history.save();

    // --- Remove request from user.requests ---
    await User.findByIdAndUpdate(userId, {
      $pull: { requests: { _id: id } },
    });

    await user.save();

    return res
      .status(200)
      .json({ message: "Request rejected and logged in history" });
  } catch (error: any) {
    console.error("Error rejecting request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all request history
export const getAllRequestHistory = async (_req: Request, res: Response) => {
  try {
    const history = await RequestHistory.find()
      .sort({ processedAt: -1 }) // newest first
      .lean();

    return res.status(200).json(history);
  } catch (error: any) {
    console.error("Error fetching request history:", error);
    return res.status(500).json({
      message: "Failed to fetch request history",
      error: error.message,
    });
  }
};

export const checkExpiration = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();

    // --- Filter allowedCategories ---
    if (user.allowedCategories && user.allowedCategories.length > 0) {
      user.allowedCategories = user.allowedCategories.filter(
        (cat: any) => cat.expiredDate > now
      );
    }

    // --- Filter allowedItems ---
    if (user.allowedItems && user.allowedItems.length > 0) {
      user.allowedItems = user.allowedItems.filter(
        (item: any) => item.expiredDate > now
      );
    }

    await user.save();

    return res.status(200).json({
      message: "Expired categories/items removed successfully",
      allowedCategories: user.allowedCategories,
      allowedItems: user.allowedItems,
    });
  } catch (error: any) {
    console.error("Error checking expiration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserSubscriptions = async (req: Request, res: Response) => {
  try {
    // Get user ID from URL parameters
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const detailedItems: any[] = [];

    // Process individual allowed items
    if (user.allowedItems && user.allowedItems.length > 0) {
      for (const allowedItem of user.allowedItems) {
        try {
          const category = await Category.findById(allowedItem.categoryId);
          if (!category) {
            console.warn(
              `Category not found for ID: ${allowedItem.categoryId}`
            );
            continue;
          }

          // Find the specific item within the category's items array
          const item = category.items?.find(
            (item: any) =>
              item._id?.toString() === allowedItem.itemId.toString()
          );

          if (!item) {
            console.warn(
              `Item not found for ID: ${allowedItem.itemId} in category: ${category.name}`
            );
            continue;
          }

          // Convert item to plain object and add metadata
          const itemObject = item.toObject ? item.toObject() : { ...item };

          detailedItems.push({
            ...itemObject,
            categoryName: category.name,
            expiredDate: allowedItem.expiredDate,
            source: "allowedItem",
          });
        } catch (itemError) {
          console.error(
            `Error processing allowed item ${allowedItem.itemId}:`,
            itemError
          );
          continue;
        }
      }
    }

    // Process allowed categories - get ALL items from these categories
    if (user.allowedCategories && user.allowedCategories.length > 0) {
      for (const allowedCategory of user.allowedCategories) {
        try {
          const category = await Category.findById(allowedCategory.categoryId);
          if (!category) {
            console.warn(
              `Category not found for ID: ${allowedCategory.categoryId}`
            );
            continue;
          }

          // Add all items from this allowed category
          if (category.items && category.items.length > 0) {
            for (const item of category.items) {
              const itemObject = item.toObject ? item.toObject() : { ...item };

              // Check if this item is already added from allowedItems to avoid duplicates
              const isDuplicate = detailedItems.some(
                (existingItem) =>
                  existingItem._id?.toString() === item._id?.toString() &&
                  existingItem.categoryName === category.name
              );

              if (!isDuplicate) {
                detailedItems.push({
                  ...itemObject,
                  categoryName: category.name,
                  expiredDate: allowedCategory.expiredDate,
                  source: "allowedCategory",
                });
              }
            }
          }
        } catch (categoryError) {
          console.error(
            `Error processing allowed category ${allowedCategory.categoryId}:`,
            categoryError
          );
          continue;
        }
      }
    }

    // Sort items by creation date (newest first)
    detailedItems.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    res.json({
      success: true,
      allowedItems: detailedItems,
      allowedCategories: user.allowedCategories || [],
      totalItems: detailedItems.length,
      totalCategories: user.allowedCategories?.length || 0,
      message:
        detailedItems.length > 0
          ? `Found ${detailedItems.length} subscription items`
          : "No subscription items found",
    });
  } catch (err: any) {
    console.error("Error in getUserSubscriptions:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
};
