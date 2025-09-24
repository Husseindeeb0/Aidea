import mongoose, { Schema, Document } from "mongoose";

export interface IRequest extends Document {
  userName: string;
  userEmail: string;
  categoryName: string;
  itemName: string;
  createdAt: Date;
}

const RequestSchema = new Schema<IRequest>(
  {
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    categoryName: { type: String, required: true, trim: true },
    itemName: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Request = mongoose.model<IRequest>("Request", RequestSchema);
