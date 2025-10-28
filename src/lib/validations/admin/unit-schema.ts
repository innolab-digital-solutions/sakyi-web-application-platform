import { z } from "zod";

/**
 * Base validation schema for unit of measurement fields
 *
 * Validates unit name and abbreviation with trimming and whitespace checks.
 * Abbreviation is limited to 10 characters (e.g., "kg", "ml", "tbsp").
 */
const BaseUnitSchema = z.object({
  name: z
    .string("Unit name is required")
    .min(1, "Unit name is required")
    .max(255, "Unit name must not exceed 255 characters")
    .trim()
    .refine((name) => name.length > 0, "Unit name cannot be empty or contain only spaces"),
  abbreviation: z
    .string("Abbreviation is required")
    .min(1, "Abbreviation is required")
    .max(10, "Abbreviation must not exceed 10 characters")
    .trim()
    .refine((abbr) => abbr.length > 0, "Abbreviation cannot be empty or contain only spaces"),
});

/**
 * Validation schema for creating new units
 *
 * Both name and abbreviation must be unique across all units.
 */
export const CreateUnitSchema = BaseUnitSchema;

/**
 * Validation schema for updating existing units
 *
 * Both name and abbreviation must be unique but can be the same as the current unit.
 */
export const UpdateUnitSchema = BaseUnitSchema;

// Default schema
export const UnitSchema = CreateUnitSchema;

export type UnitFormData = z.infer<typeof UnitSchema>;
export type CreateUnitFormData = z.infer<typeof CreateUnitSchema>;
export type UpdateUnitFormData = z.infer<typeof UpdateUnitSchema>;
