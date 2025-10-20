import { z } from "zod";

/**
 * Validation schema for unit of measurement creation/update
 *
 * Validates unit name and abbreviation with trimming and whitespace checks.
 * Abbreviation is limited to 10 characters (e.g., "kg", "ml", "tbsp").
 */
export const CreateUnitSchema = z.object({
  name: z
    .string()
    .min(1, "Unit name is required")
    .max(255, "Unit name must not exceed 255 characters")
    .trim()
    .refine((name) => name.length > 0, "Unit name cannot be empty or contain only spaces"),
  abbreviation: z
    .string()
    .min(1, "Abbreviation is required")
    .max(10, "Abbreviation must not exceed 10 characters")
    .trim()
    .refine((abbr) => abbr.length > 0, "Abbreviation cannot be empty or contain only spaces"),
});

export type CreateUnitFormData = z.infer<typeof CreateUnitSchema>;
