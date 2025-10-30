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
  question_text: z.string().min(1, "Question text is required"),
  question_type: QuestionTypeEnum,
  options: z.record(z.string(), z.unknown()).nullable().optional(),
  required: z.boolean().default(true),
  help_text: z.string().optional().nullable(),
});

export const OnboardingSectionSchema = z.object({
  title: z.string().min(1, "Section title is required"),
  description: z.string().optional().nullable(),
  order: z.number().int().nonnegative().default(0),
  questions: z.array(OnboardingQuestionSchema).default([]),
});

export const CreateOnboardingFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  published_at: z.string().min(1).nullable().optional(),
  sections: z.array(OnboardingSectionSchema).min(1, "Add at least one section"),
});

export type CreateOnboardingFormInput = z.infer<typeof CreateOnboardingFormSchema>;
