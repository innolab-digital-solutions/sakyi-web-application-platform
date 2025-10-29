import { FoodCategory } from "@/types/admin/food-category";
import { Unit } from "@/types/admin/unit";
import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface FoodItem {
  id: number;
  food_category_id: number;
  unit_id: number;
  name: string;
  description: string | null;
  calories_per_unit: number;
  category: FoodCategory;
  unit: Unit;
}

export interface FoodItemsResponse {
  status: string;
  message: string;
  data: FoodItem[];
  meta: {
    pagination: Pagination;
  };
}

export type FoodItemApiResponse = ApiResponse<FoodItem[]> | undefined;

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
