import { ApiResponse } from "@/types/shared/api";

export interface FoodItem {
  id: number;
  name: string;
  description: string | null;
  calories_per_unit: number;
  category: {
    id: number;
    name: string;
  };
  unit: {
    id: number;
    name: string;
  };
  actions: {
    edit: {
      allowed: boolean;
      reasons: string[];
    };
    delete: {
      allowed: boolean;
      reasons: string[];
    };
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
