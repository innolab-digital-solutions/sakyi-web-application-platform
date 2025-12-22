import { ApiResponse } from "@/types/shared/api";

export interface OnboardingForm {
  id: number;
  slug: string;
  title: string;
  description: string;
  status: "active" | "inactive";
  published_at: string | null;
  sections: OnboardingFormSection[];
  programs: {
    id: number;
    title: string;
    slug: string;
  }[];
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

export type OnboardingFormApiResponse = ApiResponse<OnboardingForm[]> | undefined;
