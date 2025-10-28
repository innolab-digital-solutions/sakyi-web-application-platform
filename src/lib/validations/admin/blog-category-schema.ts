import { z } from "zod";

/**
 * Validation schema for blog category creation
 *
 * Supports hierarchical categories with optional parent_id.
 * Slug is required and must be lowercase, alphanumeric, and hyphen-separated.
 */
export const CreateBlogCategorySchema = z.object({
  parent_id: z.string().or(z.number()).optional().nullable(),
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name must not exceed 255 characters")
    .trim()
    .refine((name) => name.length > 0, "Category name cannot be empty or contain only spaces"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(255, "Slug must not exceed 255 characters")
    .regex(
      // eslint-disable-next-line security/detect-unsafe-regex
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
  description: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined),
});

/**
 * Validation schema for blog category updates
 *
 * Extends create schema with stricter parent_id type (number from API).
 */
export const UpdateBlogCategorySchema = CreateBlogCategorySchema.extend({
  parent_id: z.number().nullable().optional(),
});

export type CreateBlogCategoryFormData = z.infer<typeof CreateBlogCategorySchema>;
export type UpdateBlogCategoryFormData = z.infer<typeof UpdateBlogCategorySchema>;
