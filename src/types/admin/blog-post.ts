import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface BlogPost {
  id: number;
  thumbnail: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  category: {
    id: number;
    name: string;
  };
  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

export interface BlogPostsResponse {
  status: string;
  message: string;
  data: BlogPost[];
  meta: {
    pagination: Pagination;
  };
}

export type BlogPostApiResponse = ApiResponse<BlogPost[]> | undefined;

export type BlogPostFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<BlogPost>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
};
