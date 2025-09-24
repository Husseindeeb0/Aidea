import type { LucideIcon } from "lucide-react";

export interface CategoriesCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export interface ItemsCardProps {
  icon: LucideIcon;
  title: string;
  features: string[];
  color: string;
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
  ranking: number;
  createdAt?: "";
}

export interface Item {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  state: string;
  price: number;
  ranking: number;
  createdAt: string;
}

export interface Request {
  id: string;
  userName: string;
  itemName: string;
  userEmail: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  processedDate?: string; // only added when archived
}
