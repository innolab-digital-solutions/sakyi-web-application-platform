import { ApiResponse } from "@/types/shared/api";

export interface BlogCategory {
  id: number;
  name: string;
  description: string | null;
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

export type BlogCategoryApiResponse = ApiResponse<BlogCategory[]> | undefined;

export type BlogCategoryFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<BlogCategory>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
};
