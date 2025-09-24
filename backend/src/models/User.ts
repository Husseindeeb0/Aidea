import mongoose, { Schema, Document } from "mongoose";

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
  requests: IUserRequest[];
}

const userSchema = new Schema<IUser>(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    requests: [
      new Schema<IUserRequest>(
        {
          categoryName: { type: String, required: true, trim: true },
          itemName: { type: String, required: true, trim: true },
        },
        { timestamps: { createdAt: true, updatedAt: false }, _id: true }
      ),
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
