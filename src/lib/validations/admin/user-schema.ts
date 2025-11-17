import { z } from "zod";

/**
 * Base validation schema for user fields
 *
 * Validates basic user info with trimming and whitespace-only prevention.
 */
const BaseUserSchema = z.object({
  name: z
    .string("Full name is required")
    .min(1, "Full name is required")
    .max(255, "Full name must not exceed 255 characters")
    .trim()
    .refine((name) => name.length > 0, "Full name cannot be empty or contain only spaces"),

  email: z.string("Email is required").email("Email must be valid").trim(),

  username: z
    .string("Username is required")
    .min(1, "Username is required")
    .max(50, "Username must not exceed 50 characters")
    .trim()
    .refine((username) => username.length > 0, "Username cannot be empty or contain only spaces"),

  phone: z.string().trim().optional(),

  dob: z.string().optional(), // Could also use z.date() if you handle conversion in form
  gender: z.enum(["male", "female", "other"]).optional(),
  address: z.string().optional(),

  avatar: z.any().optional(), // File or string URL

  status: z.enum(["active", "inactive"]).default("active"),

  roles: z
    .array(
      z.object({
        id: z.number().optional(),
        name: z
          .string("Role name is required")
          .min(1, "Role name is required")
          .max(255, "Role name must not exceed 255 characters")
          .trim()
          .refine((name) => name.length > 0, "Role name cannot be empty or contain only spaces"),
      }),
    )
    .min(1, "At least one role must be assigned"),
});

/**
 * Validation schema for creating a new user
 *
 * Password is required on creation.
 */
export const CreateUserSchema = BaseUserSchema.extend({
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must not exceed 255 characters"),

  password_confirmation: z
    .string("Password confirmation is required")
    .min(8, "Password confirmation must be at least 8 characters")
    .max(255, "Password confirmation must not exceed 255 characters"),
}).refine((data) => data.password === data.password_confirmation, {
  path: ["password_confirmation"],
  message: "Passwords do not match",
});

/**
 * Validation schema for updating an existing user
 *
 * Password is optional on update.
 */
export const EditUserSchema = BaseUserSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters").max(255).optional(),
  password_confirmation: z.string().min(8).max(255).optional(),
}).refine((data) => !data.password || data.password === data.password_confirmation, {
  path: ["password_confirmation"],
  message: "Passwords do not match",
});

export type UserFormData = z.infer<typeof BaseUserSchema>;
export type CreateUserFormData = z.infer<typeof CreateUserSchema>;
export type EditUserFormData = z.infer<typeof EditUserSchema>;
