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
    .max(365, "Duration value must not exceed 365"),
  duration_unit: z.enum(["days", "weeks", "months"], {
    message: "Duration unit must be days, weeks, or months",
  }),
  price: z
    .number("Price must be a number")
    .min(0, "Price must be at least 0")
    .max(999_999, "Price must not exceed 999,999"),
  status: z.enum(["draft", "published", "archived"], {
    message: "Status must be draft, published, or archived",
  }),

  // Relationship arrays (nullable)
  ideals: z
    .array(
      z.object({
        description: z
          .string("Description is required")
          .min(1, "Description is required")
          .max(255, "Description must not exceed 255 characters"),
      }),
    )
    .min(1, "At least one ideal is required"),
  key_features: z
    .array(
      z.object({
        feature: z
          .string("Feature is required")
          .min(1, "Feature is required")
          .max(255, "Feature must not exceed 255 characters"),
      }),
    )
    .min(1, "At least one key feature is required"),
  expected_outcomes: z
    .array(
      z.object({
        outcome: z
          .string("Outcome is required")
          .min(1, "Outcome is required")
          .max(255, "Outcome must not exceed 255 characters"),
      }),
    )
    .min(1, "At least one expected outcome is required"),
  structures: z
    .array(
      z.object({
        week: z
          .string("Week is required")
          .min(1, "Week is required")
          .max(50, "Week must not exceed 50 characters"),
        title: z
          .string("Title is required")
          .min(1, "Title is required")
          .max(255, "Title must not exceed 255 characters"),
        description: z.string().optional().nullable(),
      }),
    )
    .min(1, "At least one structure is required"),
  faqs: z
    .array(
      z.object({
        question: z
          .string("Question is required")
          .min(1, "Question is required")
          .max(255, "Question must not exceed 255 characters"),
        answer: z.string("Answer is required").min(1, "Answer is required"),
      }),
    )
    .min(1, "At least one FAQ is required"),
});

const ThumbnailSchema = z
  .instanceof(File, { message: "Thumbnail is required" })
  .refine((file) => file.size > 0, "Thumbnail is required")
  .refine((file) => file.size <= 2 * 1024 * 1024, "Thumbnail size must not exceed 2MB")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type),
    "Thumbnail must be a JPG, PNG, JPEG, or WEBP image",
  );

// Schema for creating new programs (thumbnail required as a File)
export const CreateProgramSchema = BaseProgramSchema.extend({
  thumbnail: ThumbnailSchema,
});

// Schema for editing existing programs (thumbnail can be File or URL string and is optional)
export const EditProgramSchema = BaseProgramSchema.extend({
  // For edit: file optional; allow preexisting URL string to keep current image
  thumbnail: ThumbnailSchema.or(z.string().url("Invalid thumbnail URL")).optional().nullable(),

  // For edit, ids are allowed for upsert/sync
  ideals: z
    .array(
      z.object({
        id: z.number().int().positive().optional().nullable(),
        description: z
          .string("Description is required")
          .min(1, "Description is required")
          .max(255, "Description must not exceed 255 characters"),
      }),
    )
    .min(1, "At least one ideal is required"),
  key_features: z
    .array(
      z.object({
        id: z.number().int().positive().optional().nullable(),
        feature: z
          .string("Feature is required")
          .min(1, "Feature is required")
          .max(255, "Feature must not exceed 255 characters"),
      }),
    )
    .min(1, "At least one key feature is required"),
  expected_outcomes: z
    .array(
      z.object({
        id: z.number().int().positive().optional().nullable(),
        outcome: z
          .string("Outcome is required")
          .min(1, "Outcome is required")
          .max(255, "Outcome must not exceed 255 characters"),
      }),
    )
    .min(1, "At least one expected outcome is required"),
  structures: z
    .array(
      z.object({
        id: z.number().int().positive().optional().nullable(),
        week: z
          .string("Week is required")
          .min(1, "Week is required")
          .max(50, "Week must not exceed 50 characters"),
        title: z
          .string("Title is required")
          .min(1, "Title is required")
          .max(255, "Title must not exceed 255 characters"),
        description: z.string().optional().nullable(),
      }),
    )
    .min(1, "At least one structure is required"),
  faqs: z
    .array(
      z.object({
        id: z.number().int().positive().optional().nullable(),
        question: z
          .string("Question is required")
          .min(1, "Question is required")
          .max(255, "Question must not exceed 255 characters"),
        answer: z.string("Answer is required").min(1, "Answer is required"),
      }),
    )
    .min(1, "At least one FAQ is required"),
});

// Default schema
export const ProgramSchema = CreateProgramSchema;

export type ProgramFormData = z.infer<typeof ProgramSchema>;
export type CreateProgramFormData = z.infer<typeof CreateProgramSchema>;
export type EditProgramFormData = z.infer<typeof EditProgramSchema>;
