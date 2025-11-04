import { z } from "zod";

/**
 * Validation schema for blog post creation/update
 * Matches backend rules for fields, types, constraints, and file handling.
 */

const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/jpg", "image/webp"]);

const ThumbnailSchema = z
  .instanceof(File, { message: "Thumbnail is required" })
  .refine((file) => file.size > 0, "Thumbnail is required")
  .refine((file) => file.size <= 2 * 1024 * 1024, "Thumbnail size must not exceed 2MB")
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.has(file.type),
    "Thumbnail must be a JPG, PNG, JPEG, or WEBP image",
  );

// Schema for creating new blog posts (thumbnail required as a File)
export const CreateBlogPostSchema = z.object({
  blog_category_id: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z
      .number("Category is required")
      .int("Category selection is invalid")
      .min(1, "Category selection is required"),
  ),
  thumbnail: ThumbnailSchema,
  title: z
    .string("Title is required")
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim()
    .refine((value) => value.length > 0, "Title cannot be empty or contain only spaces"),
  description: z.string("Description is required").min(1, "Description is required").trim(),
  content: z.string("Content is required").min(1, "Content is required").trim(),
});

// Schema for editing existing blog posts (thumbnail can be File or string and is required)
export const EditBlogPostSchema = z.object({
  blog_category_id: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z
      .number("Category is required")
      .int("Category selection is invalid")
      .min(1, "Category selection is required"),
  ),
  thumbnail: ThumbnailSchema.or(z.string().min(5, "Thumbnail is required")),
  title: z
    .string("Title is required")
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim()
    .refine((value) => value.length > 0, "Title cannot be empty or contain only spaces"),
  description: z.string("Description is required").min(1, "Description is required").trim(),
  content: z.string("Content is required").min(1, "Content is required").trim(),
});

export type BlogPostFormData = z.infer<typeof CreateBlogPostSchema>;
export type CreateBlogPostFormData = z.infer<typeof CreateBlogPostSchema>;
export type EditBlogPostFormData = z.infer<typeof EditBlogPostSchema>;
