import { ApiResponse } from "@/types/shared/api";

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
  code: string;
  thumbnail: string;
  background_image: string;
  tagline: string;
  title: string;
  slug: string;
  overview: string;
  description: string;
  duration: string;
  price: string;
  status: "draft" | "published" | "archived";
  currency: string;
  published_at?: string;
  ideals?: ProgramIdeal[];
  key_features?: ProgramKeyFeature[];
  expected_outcomes?: ProgramExpectedOutcome[];
  structures?: ProgramStructure[];
  faqs?: ProgramFAQ[];
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
