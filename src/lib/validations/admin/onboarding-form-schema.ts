import { z } from "zod";

export const QuestionTypeEnum = z.enum([
  "text",
  "textarea",
  "number",
  "select",
  "multiselect",
  "date",
  "boolean",
  "file",
]);

export const OnboardingQuestionSchema = z.object({
  question_text: z
    .string("Question text is required")
    .min(1, "Question text is required")
    .max(500, "Question text must not exceed 500 characters"),
  question_type: QuestionTypeEnum,
  options: z.array(z.unknown()).nullable().optional(),
  required: z.boolean().optional().nullable().default(true),
  help_text: z
    .string()
    .optional()
    .nullable()
    .transform((value) => value ?? undefined)
    .refine((value) => (value ? value.length <= 500 : true), {
      message: "Help text must not exceed 500 characters",
    }),
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
  order: z.number().int().nonnegative().default(0),
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
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().min(1).nullable().optional(),
  sections: z.array(OnboardingSectionSchema).min(1, "Add at least one section"),
});

export type CreateOnboardingFormInput = z.infer<typeof CreateOnboardingFormSchema>;
