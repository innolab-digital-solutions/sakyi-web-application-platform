import { ApiResponse } from "@/types/shared/api";

import { Testimonial } from "./testimonial";

export interface Ideal {
    description: string;
}

export interface Structure {
    title: string;
    description: string;
    week: number;
}

export interface KeyFeature {
    feature: string;
}

export interface ExpectedOutcome {
    outcome: string;
}

export interface Faq {
    question: string;
    answer: string;
    program_id?: number; 
    program_slug?: string; 
}

export interface Program {
    id: number;
    thumbnail: string;
    title: string;
    slug: string;
    description: string;
    duration_value: number;
    duration_unit: string;
    price: number;
    participants: number;
    published_at: string | null;
    testimonials: Testimonial[];
    rating: number;

    ideals?: Ideal[];
    structures?: Structure[];
    key_features?: KeyFeature[];
    expected_outcomes?: ExpectedOutcome[];
    faqs?: Faq[];
}

export type ProgramsApiResponse = ApiResponse<Program[]> | undefined;
export type ProgramApiResponse = ApiResponse<Program> | undefined;
