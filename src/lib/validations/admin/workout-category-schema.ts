import { z } from "zod";

/**
 * Base validation schema for workout category fields
 *
 * Supports hierarchical categories with optional parent_id.
 * Name is required and trimmed, description is optional.
 */
const BaseWorkoutCategorySchema = z.object({
  parent_id: z.string().or(z.number()).optional().nullable(),
  name: z
    .string("Category name is required")
    .min(1, "Category name is required")
    .max(255, "Category name must not exceed 255 characters")
    .trim()
    .refine((value) => value.length > 0, "Category name cannot be empty or contain only spaces"),
  description: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
});

/**
 * Validation schema for creating new workout categories
 *
 * Name must be unique across all workout categories.
 */
export const CreateWorkoutCategorySchema = BaseWorkoutCategorySchema;

/**
 * Validation schema for updating existing workout categories
 *
 * Name must be unique but can be the same as the current category.
 */
export const UpdateWorkoutCategorySchema = BaseWorkoutCategorySchema.extend({
  parent_id: z.number().nullable().optional(),
});

// Default schema (create mode)
export const WorkoutCategorySchema = CreateWorkoutCategorySchema;

export type WorkoutCategoryFormData = z.infer<typeof WorkoutCategorySchema>;
export type CreateWorkoutCategoryFormData = z.infer<typeof CreateWorkoutCategorySchema>;
export type UpdateWorkoutCategoryFormData = z.infer<typeof UpdateWorkoutCategorySchema>;
