import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface ProgramIdeal {
  id: number;
  description: string;
}

export interface ProgramKeyFeature {
  id: number;
  feature: string;
}

export interface ProgramExpectedOutcome {
  id: number;
  outcome: string;
}

export interface ProgramStructure {
  id: number;
  week: string;
  title: string;
  description: string;
}

export interface ProgramFAQ {
  id: number;
  question: string;
  answer: string;
}

export interface Program {
  id: number;
  thumbnail_url: string;
  title: string;
  slug: string;
  description: string;
  duration_value: number;
  duration_unit: "days" | "weeks" | "months";
  price: string;
  status: "draft" | "published" | "archived";
  currency: string;
  ideals?: ProgramIdeal[];
  key_features?: ProgramKeyFeature[];
  expected_outcomes?: ProgramExpectedOutcome[];
  structures?: ProgramStructure[];
  faqs?: ProgramFAQ[];
  actions?: {
    editable: boolean;
    deletable: boolean;
  };
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
