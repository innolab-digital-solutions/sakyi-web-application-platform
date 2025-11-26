import { z } from "zod";

// Allowed enums
const EnrollmentStatus = z.enum(["pending", "active", "paused", "completed", "canceled"]);
const DurationUnit = z.enum(["days", "weeks", "months"]);

export const CreateEnrollmentSchema = z.object({
  user_id: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z.number().min(1, "User selection is required"),
  ),

  team_id: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z.number().min(1, "Team selection is required"),
  ),

  program_id: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z.number().min(1, "Program selection is required"),
  ),

  onboarding_submission_id: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z.number().min(1, "Submission selection is required"),
  ),

  status: EnrollmentStatus.default("pending"),

  duration_value: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z.number().min(1, "Duration must be at least 1").max(365, "Duration cannot exceed 365"),
  ),

  duration_unit: DurationUnit,

  started_at: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Start date must be a valid date"),

  ended_at: z
    .string()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), "End date must be a valid date")
    .optional(),

  notes: z.string().max(1000, "Notes must not exceed 1000 characters").trim().optional(),
});

export type CreateEnrollmentFormData = z.infer<typeof CreateEnrollmentSchema>;
