import mongoose, { Schema, Document} from "mongoose";

export interface IRequestHistory extends Document {
  userName: string;
  userEmail: string;
  categoryName: string;
  itemName: string;
  createdAt: Date;
  processedAt: Date; // date of accept/reject
  state: "accepted" | "rejected";
}

const RequestHistorySchema = new Schema<IRequestHistory>(
  {
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    categoryName: { type: String, required: true, trim: true },
    itemName: { type: String, required: true, trim: true },
    processedAt: { type: Date, required: true },
    state: {
      type: String,
      enum: ["accepted", "rejected"],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const RequestHistory = mongoose.model<IRequestHistory>(
  "RequestHistory",
  RequestHistorySchema
);
