import { z } from "zod";

/**
 * Validation schema for food category creation
 *
 * Supports hierarchical categories with optional parent_id.
 * Parent can be string (from form select) or number (from API).
 */
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

/**
 * Validation schema for food category updates
 *
 * Extends create schema with stricter parent_id type (number from API).
 */
export const UpdateFoodCategorySchema = CreateFoodCategorySchema.extend({
  parent_id: z.number().nullable().optional(),
});

export type CreateFoodCategoryFormData = z.infer<typeof CreateFoodCategorySchema>;
export type UpdateFoodCategoryFormData = z.infer<typeof UpdateFoodCategorySchema>;
