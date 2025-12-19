import { ApiResponse } from "@/types/shared/api";

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
