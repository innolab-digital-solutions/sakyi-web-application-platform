import { z } from "zod";

const BaseTestimonialSchema = z.object({
  program_id: z.coerce.number().int().min(1, "Program is required"),
  name: z.string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
  picture: z.any().optional(),
  rating: z.coerce
    .number()
    .int()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  comment: z.string().min(1, "Comment is required"),
});

export const CreateTestimonialSchema = BaseTestimonialSchema;

export const UpdateTestimonialSchema = BaseTestimonialSchema;

export type CreateTestimonialInput = z.infer<typeof CreateTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof UpdateTestimonialSchema>;
