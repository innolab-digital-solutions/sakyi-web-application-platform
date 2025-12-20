import { ApiResponse } from "@/types/shared/api";

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
