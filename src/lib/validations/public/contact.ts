import { z } from "zod";

/**
 * Validation schema for public contact form
 *
 * Validates contact form data matching backend Laravel validation rules:
 * - name: required, string, max 255 characters
 * - email: required, valid email (RFC/DNS), lowercase, max 255 characters
 * - phone: required, string, max 255 characters
 * - subject: required, string, max 255 characters
 * - message: required, string
 */
export const ContactFormSchema = z.object({
  name: z
    .string("Name is required")
    .min(1, "Name is required")
    .max(255, "Name must not exceed 255 characters")
    .trim()
    .refine((value) => value.length > 0, "Name cannot be empty or contain only spaces"),

  email: z
    .string("Email is required")
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase()
    .trim(),

  phone: z
    .string("Phone is required")
    .min(1, "Phone is required")
    .max(255, "Phone must not exceed 255 characters")
    .trim()
    .refine((value) => value.length > 0, "Phone cannot be empty or contain only spaces"),

  subject: z
    .string("Subject is required")
    .min(1, "Subject is required")
    .max(255, "Subject must not exceed 255 characters")
    .trim()
    .refine((value) => value.length > 0, "Subject cannot be empty or contain only spaces"),

  message: z
    .string("Message is required")
    .min(1, "Message is required")
    .trim()
    .refine((value) => value.length > 0, "Message cannot be empty or contain only spaces"),
});

/**
 * Inferred TypeScript type for contact form data
 */
export type ContactFormData = z.infer<typeof ContactFormSchema>;
