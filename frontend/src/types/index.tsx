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
  ranking: number;
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
  ranking: number;
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
