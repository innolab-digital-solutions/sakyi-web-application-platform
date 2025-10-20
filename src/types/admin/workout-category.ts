import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface WorkoutCategoryChild {
  id: number;
  name: string;
  description: string | null;
}

export interface WorkoutCategory {
  id: number;
  name: string;
  description: string | null;
  parent: WorkoutCategoryChild | null;
  children: WorkoutCategoryChild[];
}

export interface WorkoutCategoriesResponse {
  status: string;
  message: string;
  data: WorkoutCategory[];
  meta: {
    pagination: Pagination;
  };
}

export type WorkoutCategoryApiResponse = ApiResponse<WorkoutCategory[]> | undefined;

export type WorkoutCategoryFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<WorkoutCategory>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
};
