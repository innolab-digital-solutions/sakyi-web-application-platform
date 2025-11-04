import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

export interface BlogCategoriesResponse {
  status: string;
  message: string;
  data: BlogCategory[];
  meta: {
    pagination: Pagination;
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
