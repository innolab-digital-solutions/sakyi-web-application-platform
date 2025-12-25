import { ApiResponse } from "@/types/shared/api";

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
