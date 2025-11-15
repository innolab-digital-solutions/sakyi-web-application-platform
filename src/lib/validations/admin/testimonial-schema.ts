import { z } from "zod";

export const CreateTestimonialSchema = z.object({
  enrollment_id: z.string(),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().min(1, "Comment is required"),
});

export const UpdateTestimonialSchema = z.object({
  enrollment_id: z.string(),
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().min(1, "Comment is required"),
});

export type CreateTestimonialInput = z.infer<typeof CreateTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof UpdateTestimonialSchema>;
