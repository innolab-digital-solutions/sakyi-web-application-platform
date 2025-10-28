import { ApiResponse } from "../shared/api";

export interface FoodItem {
  id: number;
  food_category_id: number;
  unit_id: number;
  name: string;
  description: string | null;
  calories_per_unit: number;
  created_at?: string;
  updated_at?: string;

  // Relations
  category?: {
    id: number;
    name: string;
  };
  unit?: {
    id: number;
    name: string;
    abbreviation?: string | null;
  };
}

export interface FoodItemsResponse {
  status: string;
  message: string;
  data: FoodItem[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {
        next: string | null;
        previous: string | null;
      };
    };
  };
}

export type FoodItemApiResponse = ApiResponse<FoodItem[]>;

export type FoodItemsListApiResponse = ApiResponse<FoodItemsResponse>;

export type FoodItemFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<FoodItem>;
  open?: boolean;
  title?: string;
  onOpenChange?: (open: boolean) => void;
  name?: string;
  description?: string;
  calories_per_unit?: number;
  food_category_id?: number;
  unit_id?: number;
};
