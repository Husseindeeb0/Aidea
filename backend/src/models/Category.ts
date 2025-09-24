import mongoose, { Schema, Document } from "mongoose";

export interface IItem extends Document {
  title: string;
  description: string;
  url: string;
  category: mongoose.Types.ObjectId;
  state: "متاح" | "قريباً" | "مؤرشف";
  rank: number;
  price: number;
  createdAt: Date;
}

export interface ICategory extends Document {
  name: string;
  description: string;
  rank: number;
  price: number;
  items: IItem[];
  createdAt: Date;
}

// Item Schema
const ItemSchema = new Schema<IItem>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    url: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    state: {
      type: String,
      enum: ["متاح", "قريباً", "مؤرشف"],
      default: "متاح",
    },
    rank: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Category Schema
const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    rank: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    items: [ItemSchema],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
export const Item = mongoose.model<IItem>("Item", ItemSchema);
