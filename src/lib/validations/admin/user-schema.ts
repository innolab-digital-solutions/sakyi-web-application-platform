import { z } from "zod";

const phoneRegex = /^[0-9]{6,15}$/;

/**
 * Base validation schema for user fields
 *
 * Validates basic user info with trimming and whitespace-only prevention.
 * This schema is shared between create and update flows; per-mode
 * requirements (like required vs optional) are handled in the
 * extended schemas below.
 */
const BaseUserSchema = z.object({
  name: z
    .string("Full name is required")
    .min(1, "Full name is required")
    .max(255, "Full name must not exceed 255 characters")
    .trim()
    .refine((name) => name.length > 0, "Full name cannot be empty or contain only spaces"),

  email: z
    .string("Email is required")
    .email("Email must be valid")
    .max(255, "Email must not exceed 255 characters")
    .trim(),

  // Phone is required on create, optional on update – see CreateUserSchema/EditUserSchema
  phone: z.string().trim().regex(phoneRegex, "Phone must be 6–15 digits").optional(),

  dob: z.string("Date of birth is required").min(1, "Date of birth is required"),

  // Backend: male | female | other
  // Use string + refinements so empty string triggers a clear "required" error.
  gender: z
    .string("Gender is required")
    .min(1, "Gender is required")
    .refine((value) => ["male", "female", "other"].includes(value), {
      message: "Gender must be either 'male', 'female', or 'other'.",
    }),

  address: z.string().max(255, "Address must not exceed 255 characters").optional(),

  // File or string URL. When it's a File, mirror Laravel: image, mimes, max:2048 KB
  picture: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file || typeof file === "string") return true;
        if (!(file instanceof File)) return false;
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        const isValidType = allowedTypes.includes(file.type);
        const isValidSize = file.size <= 2 * 1024 * 1024;
        return isValidType && isValidSize;
      },
      {
        message: "Avatar must be a JPG, JPEG, PNG, or WEBP image and not larger than 2MB",
      },
    ),

  // Frontend stores role as a string id; backend expects nullable integer role_id.
  // We only ensure it's either empty or numeric; actual existence is validated on the backend.
  role: z.string().trim().regex(/^\d*$/, "Role must be a valid role id").optional(),
});

/**
 * Validation schema for creating a new user
 *
 * Password is required on creation.
 */
export const CreateUserSchema = BaseUserSchema.extend({
  // Create: phone is required and must match backend regex
  phone: BaseUserSchema.shape.phone.refine((value) => !!value && value.length > 0, {
    message: "Phone is required",
  }),

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
