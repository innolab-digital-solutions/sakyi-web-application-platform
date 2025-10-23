import { z } from "zod";

/**
 * Validation schema for workout creation/update
 *
 * Validates name, description, equipment, difficulty, category, GIF path, and video URL.
 */
export const WorkoutSchema = z.object({
  workout_category_id: z.string().or(z.number()).optional(),
  name: z
    .string()
    .min(1, "Workout name is required")
    .max(255, "Workout name must not exceed 255 characters")
    .trim()
    .refine((value) => value.length > 0, "Workout name cannot be empty or contain only spaces"),
  description: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  equipment: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  gif_path: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
  video_url: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
});

export type WorkoutFormData = z.infer<typeof CreateWorkoutSchema>;
