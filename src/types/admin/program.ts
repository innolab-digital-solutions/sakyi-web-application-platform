import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface Program {
  id: number;
  thumbnail_url: string;
  title: string;
  slug: string;
  description: string;
  duration_value: number;
  duration_unit: "days" | "weeks" | "months";
  price: string;
  status: "active" | "inactive" | "archived";
  currency: string;
}

export interface ProgramsResponse {
  status: string;
  message: string;
  data: Program[];
  meta: {
    pagination: Pagination;
  };
}

export type ProgramApiResponse = ApiResponse<Program[]> | undefined;

export type ProgramFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<Program>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
};
