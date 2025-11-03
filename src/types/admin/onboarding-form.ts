import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface OnboardingForm {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  sections: OnboardingFormSection[];
  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

export interface OnboardingFormSection {
  id: number;
  title: string;
  description: string;
  questions: OnboardingFormQuestion[];
}

export interface OnboardingFormQuestion {
  id: number;
  question: string;
  type: "text" | "select" | "multiselect" | "date" | "file";
  options: Record<string, unknown>[];
  required: boolean;
}

export interface OnboardingFormsResponse {
  status: string;
  message: string;
  data: OnboardingForm[];
  meta: {
    pagination: Pagination;
  };
}

export type OnboardingFormApiResponse = ApiResponse<OnboardingForm[]> | undefined;
