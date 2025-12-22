import { z } from "zod";

export const QuestionTypeEnum = z.enum(["text", "select", "multiselect", "date", "file"]);

export const OnboardingQuestionSchema = z.object({
  question: z
    .string("Question is required")
    .min(1, "Question is required")
    .max(500, "Question must not exceed 500 characters"),
  type: QuestionTypeEnum,
  options: z.array(z.unknown()).nullable().optional(),
  required: z.boolean().optional().nullable().default(true),
});

export const OnboardingSectionSchema = z.object({
  title: z
    .string("Section title is required")
    .min(1, "Section title is required")
    .max(180, "Section title must not exceed 180 characters"),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((value) => value ?? undefined)
    .refine((value) => (value ? value.length <= 2000 : true), {
      message: "Section description must not exceed 2000 characters",
    }),
  questions: z
    .array(OnboardingQuestionSchema)
    .min(1, "Each section must contain at least one question"),
});

export const CreateOnboardingFormSchema = z.object({
  title: z
    .string("Title is required")
    .min(1, "Title is required")
    .max(180, "Title must not exceed 180 characters"),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((value) => value ?? undefined)
    .refine((value) => (value ? value.length <= 2000 : true), {
      message: "Description must not exceed 2000 characters",
    }),
  status: z.enum(["active", "inactive"]).default("active"),
  published_at: z.string().min(1).nullable().optional(),
  sections: z.array(OnboardingSectionSchema).min(1, "Add at least one section"),
});

export type CreateOnboardingFormInput = z.infer<typeof CreateOnboardingFormSchema>;
