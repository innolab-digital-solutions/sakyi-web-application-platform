import { Pagination } from "@/types/shared/common";

import { ApiResponse } from "../shared/api";

/**
 * Enrollment linked to testimonial
 */
export interface Enrollment {
  id: number;
  unique_id: string;
  user: {
    id: number;
    name: string;
  };
  program: {
    id: number;
    title: string;
  };
}

/**
 * Testimonial model
 */
export interface Testimonial {
  id: number;
  enrollment?: Enrollment;
  rating: number; // 1 to 5
  comment: string;
  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

/**
 * API response containing multiple testimonials with pagination
 */
export interface TestimonialsResponse {
  status: string;
  message: string;
  data: Testimonial[];
  meta: {
    pagination: Pagination;
  };
}

/**
 * Type for API response (used in hooks)
 */
export type TestimonialApiResponse = ApiResponse<Testimonial[]> | undefined;

/**
 * Form properties for creating or editing a testimonial
 */
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
