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

// TODO: Change id into string when using database
export interface Category {
  id: number;
  name: string;
  description: string;
  ranking: number;
}

// TODO: Change id into string when using database
export interface Item {
  id: number;
  title: string;
  description: string;
  url: string;
  category: string;
  state: string;
  price: number;
  ranking: number;
  createdAt: string;
}

// TODO: Change id into string when using database
export interface Request {
  id: number;
  userName: string;
  itemName: string;
  userEmail: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  processedDate?: string; // only added when archived
}