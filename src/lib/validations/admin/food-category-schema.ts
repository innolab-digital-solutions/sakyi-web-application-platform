import { z } from "zod";

export const CreateFoodCategorySchema = z.object({
  parent_id: z.string().or(z.number()).optional().nullable(),
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name must not exceed 255 characters")
    .trim()
    .refine((name) => name.length > 0, "Category name cannot be empty or contain only spaces"),
  description: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined),
});

export type CreateFoodCategoryFormData = z.infer<typeof CreateFoodCategorySchema>;
export type UpdateFoodCategoryFormData = z.infer<typeof CreateFoodCategorySchema>;

export const UpdateFoodCategorySchema = CreateFoodCategorySchema.extend({
  parent_id: z.number().nullable().optional(), // null if root category
});
