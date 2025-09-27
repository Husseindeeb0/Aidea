import mongoose, { Schema, Document } from "mongoose";

export interface IAllowedCategory {
  categoryId: mongoose.Types.ObjectId | string;
  expiredDate: Date;
}

export interface IAllowedItem {
  itemId: mongoose.Types.ObjectId | string;
  categoryId?: mongoose.Types.ObjectId | string;
  expiredDate: Date;
}

export interface IUserRequest {
  _id?: mongoose.Types.ObjectId;
  categoryName: string;
  itemName: string;
  createdAt: Date;
}

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  avatar: string;
  role: string;
  requests: IUserRequest[];
  allowedCategories?: IAllowedCategory[];
  allowedItems?: IAllowedItem[];
}

const allowedCategorySchema = new Schema(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    expiredDate: { type: Date },
  },
  { _id: false }
);

const allowedItemSchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    itemId: { type: Schema.Types.ObjectId, ref: "Item" },
    expiredDate: { type: Date },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, default: "user" },
    requests: [
      new Schema<IUserRequest>(
        {
          categoryName: { type: String, required: true, trim: true },
          itemName: { type: String, trim: true },
        },
        { timestamps: { createdAt: true, updatedAt: false }, _id: true }
      ),
    ],
    allowedCategories: [allowedCategorySchema],
    allowedItems: [allowedItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
