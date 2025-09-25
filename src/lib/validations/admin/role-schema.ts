import { z } from "zod";

export const CreateRoleSchema = z.object({
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

export type CreateRoleFormData = z.infer<typeof CreateRoleSchema>;
