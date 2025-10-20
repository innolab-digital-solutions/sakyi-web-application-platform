import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface FoodCategoryChild {
  id: number;
  name: string;
  description: string | null;
}

export interface FoodCategory {
  id: number;
  name: string;
  description: string | null;
  parent: FoodCategoryChild | null;
  children: FoodCategoryChild[];
}

export interface FoodCategoriesResponse {
  status: string;
  message: string;
  data: FoodCategory[];
  meta: {
    pagination: Pagination;
  };
}

export type FoodCategoryApiResponse = ApiResponse<FoodCategory[]> | undefined;

export type FoodCategoryFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<FoodCategory>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
};
