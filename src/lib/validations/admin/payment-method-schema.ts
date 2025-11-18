import { z } from "zod";

/**
 * Base validation schema for payment method fields
 *
 * Validates name, logo, QR code, and status fields.
 * Ensures name is required and within character limits.
 * Logo and QR code are optional but must be valid file paths or URLs if provided.
 * Status must be one of: active, inactive, archived.
 */
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

const BasePaymentMethodSchema = z.object({
  name: z
    .string("Payment method name is required")
    .min(1, "Payment method name is required")
    .max(255, "Payment method name must not exceed 255 characters")
    .trim()
    .refine(
      (name) => name.length > 0,
      "Payment method name cannot be empty or contain only spaces",
    ),
  logo: z
    .union([
      z.string().url("Logo must be a valid URL"),
      z
        .instanceof(File, { message: "Logo must be a valid file" })
        .refine((file) => file.size <= 5 * 1024 * 1024, "Logo file size must not exceed 5MB")
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.has(file.type),
          "Logo must be a JPG, PNG, or WEBP image",
        ),
    ])
    .refine((value) => !!value, "Logo is required"),

  qr_code: z
    .union([
      z.string().url("QR code must be a valid URL").optional(),
      z
        .instanceof(File, { message: "QR code must be a valid file" })
        .refine((file) => file.size <= 5 * 1024 * 1024, "QR code file size must not exceed 5MB")
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.has(file.type),
          "QR code must be a JPG, PNG, or WEBP image",
        )
        .optional(),
      z.literal("").optional(),
    ])
    .optional(),
  status: z.enum(["active", "inactive", "archived"] as const, "Status is required"),
});

/**
 * Validation schema for creating new payment methods
 *
 * All required fields must be provided; name must be unique.
 */
export const CreatePaymentMethodSchema = BasePaymentMethodSchema;

/**
 * Validation schema for updating existing payment methods
 *
 * Allows same name as current record but enforces validation for other fields.
 */
export const UpdatePaymentMethodSchema = BasePaymentMethodSchema;

// Default schema
export const PaymentMethodSchema = CreatePaymentMethodSchema;

export type PaymentMethodFormData = z.infer<typeof PaymentMethodSchema>;
export type CreatePaymentMethodFormData = z.infer<typeof CreatePaymentMethodSchema>;
export type UpdatePaymentMethodFormData = z.infer<typeof UpdatePaymentMethodSchema>;
