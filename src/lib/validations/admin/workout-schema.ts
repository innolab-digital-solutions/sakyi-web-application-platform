import { z } from "zod";

const GifSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "Thumbnail is required")
  .refine((file) => file.size <= 2 * 1024 * 1024, "Thumbnail size must not exceed 2MB")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type),
    "Thumbnail must be a JPG, PNG, JPEG, or WEBP image",
  )
  .or(z.string().url("GIF must be a valid URL")); // allow URL as well

export const CreateWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required").max(255).trim(),
  description: z.string().max(1000).optional(),
  gif: GifSchema, // required
  video: z.string().url().optional(), // only URL
  equipment: z.string().max(255).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  workout_category_id: z.number().int().positive("Category is required"),
});

export const UpdateWorkoutSchema = z.object({
  name: z.string().min(1, "Workout name is required").max(255).trim().optional(),
  description: z.string().max(1000).optional(),
  gif: GifSchema.optional(), // optional for edit
  video: z.string().url().optional(),
  equipment: z.string().max(255).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  workout_category_id: z.number().int().positive().optional(),
});

export type CreateWorkoutFormData = z.infer<typeof CreateWorkoutSchema>;
export type UpdateWorkoutFormData = z.infer<typeof UpdateWorkoutSchema>;
