import { z } from "zod";

/**
 * Validation schema for role creation/update
 *
 * Validates role name with trimming and whitespace-only prevention.
 * Description is optional and automatically trimmed.
 */
export const ProgramSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .trim()
    .refine((value) => value.length > 0, "Title cannot be empty or contain only spaces"),
  description: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined),
  thumbnail: z.custom<File | null>().superRefine((file, context) => {
    // Required
    if (!file) {
      context.addIssue({ code: z.ZodIssueCode.custom, message: "Thumbnail is required" });
      return;
    }

    // Type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"] as const;
    if (!allowedTypes.includes((file as File).type as (typeof allowedTypes)[number])) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Thumbnail must be a JPG, PNG, JPEG, or WEBP image",
      });
    }

    // Size (2MB)
    const maxBytes = 2 * 1024 * 1024;
    if ((file as File).size > maxBytes) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Thumbnail size must not exceed 2MB",
      });
    }
  }),
  duration_value: z.coerce
    .number()
    .int("Duration value must be an integer")
    .min(1, "Duration value must be at least 1")
    .max(365, "Duration value must not exceed 365"),
  duration_unit: z.enum(["days", "weeks", "months"]),
  price: z.coerce
    .number()
    .min(0, "Price must be at least 0")
    .max(999_999, "Price must not exceed 999,999"),
  status: z.enum(["active", "inactive", "archived"]),
});

export type ProgramFormData = z.infer<typeof ProgramSchema>;
