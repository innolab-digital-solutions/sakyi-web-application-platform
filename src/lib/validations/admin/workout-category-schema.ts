import { z } from "zod";

export const WorkoutCategorySchema = z.object({
  parent_id: z.string().or(z.number()).optional().nullable(),
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name must not exceed 255 characters")
    .trim()
    .refine((value) => value.length > 0, "Category name cannot be empty or contain only spaces"),
  description: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
});

export type WorkoutCategoryFormData = z.infer<typeof WorkoutCategorySchema>;
