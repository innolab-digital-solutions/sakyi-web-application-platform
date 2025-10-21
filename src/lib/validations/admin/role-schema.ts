import { z } from "zod";

/**
 * Base validation schema for role fields
 *
 * Validates role name with trimming and whitespace-only prevention.
 * Description is optional and automatically trimmed.
 */
const BaseRoleSchema = z.object({
  name: z
    .string("Role name is required")
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
 * Validation schema for creating new roles
 *
 * Name must be unique across all roles.
 */
export const CreateRoleSchema = BaseRoleSchema;

/**
 * Validation schema for updating existing roles
 *
 * Name must be unique but can be the same as the current role.
 */
export const UpdateRoleSchema = BaseRoleSchema;

/**
 * Validation schema for assigning permissions to a role
 */
export const AssignPermissionsSchema = z.object({
  permissions: z.array(z.string()).optional().default([]),
});

// Default schema (create mode)
export const RoleSchema = CreateRoleSchema;

export type RoleFormData = z.infer<typeof RoleSchema>;
export type CreateRoleFormData = z.infer<typeof CreateRoleSchema>;
export type UpdateRoleFormData = z.infer<typeof UpdateRoleSchema>;
export type AssignPermissionsFormData = z.infer<typeof AssignPermissionsSchema>;
