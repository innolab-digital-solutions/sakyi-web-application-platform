import { z } from "zod";

/**
 * Base validation schema for food category fields
 *
 * Supports hierarchical categories with optional parent_id.
 * Parent can be string (from form select) or number (from API).
 */
const BaseFoodCategorySchema = z.object({
  parent_id: z.string().or(z.number()).optional().nullable(),
  name: z
    .string("Category name is required")
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
 * Validation schema for creating new food categories
 *
 * Name must be unique across all food categories.
 */
export const CreateFoodCategorySchema = BaseFoodCategorySchema;

/**
 * Validation schema for updating existing food categories
 *
 * Name must be unique but can be the same as the current category.
 */
export const UpdateFoodCategorySchema = BaseFoodCategorySchema.extend({
  parent_id: z.number().nullable().optional(),
});

// Default schema (create mode)
export const FoodCategorySchema = CreateFoodCategorySchema;

export type FoodCategoryFormData = z.infer<typeof FoodCategorySchema>;
export type CreateFoodCategoryFormData = z.infer<typeof CreateFoodCategorySchema>;
export type UpdateFoodCategoryFormData = z.infer<typeof UpdateFoodCategorySchema>;
