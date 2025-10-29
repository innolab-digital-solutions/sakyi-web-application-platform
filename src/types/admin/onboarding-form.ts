import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface OnboardingForm {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: string;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
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
  order: number;
  questions: OnboardingFormQuestion[];
}

export interface OnboardingFormQuestion {
  id: number;
  question_text: string;
  question_type: string;
  options: Record<string, unknown>[];
  required: boolean;
  help_text: string;
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
