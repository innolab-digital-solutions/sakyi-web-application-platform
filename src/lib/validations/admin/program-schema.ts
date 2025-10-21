import { z } from "zod";

/**
 * Validation schema for program creation/update
 *
 * Validates program data with comprehensive field validation including
 * file upload constraints, numeric ranges, and enum values.
 */
const BaseProgramSchema = z.object({
  title: z
    .string("Title is required")
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim()
    .refine((value) => value.length > 0, "Title cannot be empty or contain only spaces"),
  description: z.string("Description is required").min(1, "Description is required").trim(),
  duration_value: z
    .number("Duration value must be a number")
    .int("Duration value must be an integer")
    .min(1, "Duration value must be at least 1")
    .max(365, "Duration value must not exceed 365 days"),
  duration_unit: z.enum(["days", "weeks", "months"], {
    message: "Duration unit must be days, weeks, or months",
  }),
  price: z
    .number("Price must be a number")
    .min(0, "Price must be at least 0")
    .max(999_999, "Price must not exceed 999,999"),
  status: z.enum(["active", "inactive", "archived"], {
    message: "Status must be active, inactive, or archived",
  }),
});

const ThumbnailSchema = z
  .instanceof(File, { message: "Thumbnail is required" })
  .refine((file) => file.size > 0, "Thumbnail is required")
  .refine((file) => file.size <= 2 * 1024 * 1024, "Thumbnail size must not exceed 2MB")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type),
    "Thumbnail must be a JPG, PNG, JPEG, or WEBP image",
  );

// Schema for creating new programs (thumbnail required)
export const CreateProgramSchema = BaseProgramSchema.extend({
  thumbnail: ThumbnailSchema,
});

// Schema for editing existing programs (thumbnail optional)
export const EditProgramSchema = BaseProgramSchema.extend({
  thumbnail: ThumbnailSchema.optional(),
});

// Default schema (create mode)
export const ProgramSchema = CreateProgramSchema;

export type ProgramFormData = z.infer<typeof ProgramSchema>;
export type CreateProgramFormData = z.infer<typeof CreateProgramSchema>;
export type EditProgramFormData = z.infer<typeof EditProgramSchema>;
