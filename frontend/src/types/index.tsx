import type { LucideIcon } from "lucide-react";

export interface CategoriesCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface ItemsCardProps {
  item: Item;
}

export interface AuthProps {
  userData: any | null;
  isAuthenticating: boolean;
  error: string | null;
}

export interface CategoryProps {
  categoryData: any | null;
  isLoading: boolean;
  error: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  price: number;
  rank: number;
  items?: Item[];
  createdAt?: "";
}

export interface Item {
  id: string;
  title: string;
  description: string;
  url: string;
  categoryName: string;
  state: string;
  price: number;
  rank: number;
  createdAt: string;
}

export interface Request {
  userId: string;
  id: string;
  userName: string;
  itemName?: string;
  categoryName: string;
  userEmail: string;
  createdAt: string;
}

export interface RequestHistory {
  userId: string;
  id: string;
  userName: string;
  itemName?: string;
  categoryName: string;
  userEmail: string;
  processedAt: Date;
  expiredDate: Date;
  state: String;
}

export interface SubscriptionItem {
  _id: string;
  title: string;
  description: string;
  url?: string;
  state: "متاح" | "قريباً" | "مؤرشف";
  price: number;
  createdAt: string;
  categoryName: string;
  expiredDate: string;
  source?: "allowedItem" | "allowedCategory";
}
