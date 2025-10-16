import { z } from "zod";

/**
 * Validation schema for role creation/update
 *
 * Validates role name with trimming and whitespace-only prevention.
 * Description is optional and automatically trimmed.
 */
export const RoleSchema = z.object({
  name: z
    .string()
    .min(1, "Role name is required")
    .max(255, "Role name must not exceed 255 characters")
    .trim()
    .refine((name) => name.length > 0, "Role name cannot be empty or contain only spaces"),
  description: z
    .string()
    .optional()
    .transform((value) => value?.trim() || undefined),
});

/**
 * Validation schema for assigning permissions to a role
 */
export const AssignPermissionsSchema = z.object({
  permissions: z.array(z.string()).optional().default([]),
});

export type RoleFormData = z.infer<typeof RoleSchema>;
export type AssignPermissionsFormData = z.infer<typeof AssignPermissionsSchema>;
