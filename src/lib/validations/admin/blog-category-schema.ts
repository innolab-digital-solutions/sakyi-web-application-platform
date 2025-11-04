import { z } from "zod";

/**
 * Base validation schema for blog category fields
 *
 * Name is required and trimmed, must not exceed 255 characters.
 * Description is optional and automatically trimmed.
 * Backend manages name uniqueness (not checked client-side).
 */
const BaseBlogCategorySchema = z.object({
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
 * Validation schema for creating new blog categories
 *
 * Name must be unique across all blog categories (checked by the server).
 */
export const CreateBlogCategorySchema = BaseBlogCategorySchema;

/**
 * Validation schema for updating existing blog categories
 *
 * Name must be unique but can be the same as the current category (checked by the server).
 */
export const UpdateBlogCategorySchema = BaseBlogCategorySchema;

export type BlogCategoryFormData = z.infer<typeof BaseBlogCategorySchema>;
export type CreateBlogCategoryFormData = z.infer<typeof CreateBlogCategorySchema>;
export type UpdateBlogCategoryFormData = z.infer<typeof UpdateBlogCategorySchema>;
