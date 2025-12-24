import { ApiResponse } from "@/types/shared/api";

export interface Testimonial {
  id: number;
  rating: number;
  comment: string;
  enrollment: {
    code: string;
    client: {
      id: number;
      name: string;
      picture: string;
    };
    program: {
      id: number;
      title: string;
      thumbnail: string;
    };
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

export type TestimonialApiResponse = ApiResponse<Testimonial[]> | undefined;

export type TestimonialFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<Testimonial>;
  open?: boolean;
  title?: string;
  onOpenChange?: (open: boolean) => void;
  rating?: number;
  comment?: string;
};
