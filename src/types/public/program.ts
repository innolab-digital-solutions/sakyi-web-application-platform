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
  
  export interface ProgramTestimonial {
    id: number;
    rating: number;
    comment: string;
    reviewer: {
        name: string;
        picture: string;
    };
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
    duration_value: number;
    duration_unit: "days" | "weeks" | "months";
    price: string;
    status: "draft" | "published" | "archived";
    currency: string;
    published_at?: string;
    avg_rating: number;
participants: number;
    ideals?: ProgramIdeal[];
    key_features?: ProgramKeyFeature[];
    expected_outcomes?: ProgramExpectedOutcome[];
    structures?: ProgramStructure[];
    attached_onboarding_form?: {
      id: number;
      title: string;
    };
    faqs?: ProgramFAQ[];
    testimonials?: ProgramTestimonial[];
  }
  
  export type ProgramApiResponse = ApiResponse<Program[]> | undefined;