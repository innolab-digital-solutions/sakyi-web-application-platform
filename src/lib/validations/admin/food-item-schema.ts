import { z } from "zod";

export const CreateFoodItemSchema = z.object({
  name: z
    .string()
    .min(1, "Food item name is required")
    .max(255, "Food item name must not exceed 255 characters")
    .trim()
    .refine((name) => name.length > 0, "Food item name cannot be empty or contain only spaces"),

  calories_per_unit: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseFloat(value) : value),
    z.number().min(0.01, "Calories must be greater than 0"),
  ),

  food_category_id: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z.number().min(1, "Food category selection is required"),
  ),

  unit_id: z.preprocess(
    (value) => (typeof value === "string" ? Number.parseInt(value, 10) : value),
    z.number().min(1, "Unit selection is required"),
  ),

  description: z.string().max(500, "Description must not exceed 500 characters").trim().optional(),
});

export type CreateFoodItemFormData = z.infer<typeof CreateFoodItemSchema>;
