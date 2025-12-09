import { z } from "zod";

export const InstructionMealSchema = z.object({
  id: z.number().optional(),
  meal_slot_id: z.number().min(1, "Meal slot is required"),
  calorie_target: z.number().min(0, "Calorie target must be 0 or greater"),
  notes: z.string().optional().nullable().default(""),
});

export const InstructionWorkoutSchema = z
  .object({
    id: z.number().optional(),
    workout_id: z.number().min(1, "Workout is required"),
    sets: z.number().min(1).nullable().optional(),
    reps: z.number().min(1).nullable().optional(),
    duration_min: z.number().min(1).nullable().optional(),
    notes: z.string().optional().nullable().default(""),
  })
  .refine((data) => data.sets !== null || data.reps !== null || data.duration_min !== null, {
    message: "At least one of sets, reps, or duration must be provided",
  });

export const InstructionActivitySchema = z.object({
  id: z.number().optional(),
  activity_id: z.number().min(1, "Activity is required"),
  target_value: z.number().min(0, "Target value must be 0 or greater"),
  notes: z.string().optional().nullable().default(""),
});

export const InstructionWaterSchema = z.object({
  target_ml: z.number().min(0, "Water target must be 0 or greater"),
  notes: z.string().optional().nullable().default(""),
});

export const InstructionSleepSchema = z.object({
  target_hours: z
    .number()
    .min(0, "Sleep target must be 0 or greater")
    .max(24, "Sleep target cannot exceed 24 hours"),
  notes: z.string().optional().nullable().default(""),
});

export const InstructionDaySchema = z.object({
  id: z.number().optional(),
  day_number: z.number().min(1, "Day number is required"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional().nullable().default(""),
  meals: z.array(InstructionMealSchema).optional().default([]),
  workouts: z.array(InstructionWorkoutSchema).optional().default([]),
  activities: z.array(InstructionActivitySchema).optional().default([]),
  water: InstructionWaterSchema.optional(),
  sleep: InstructionSleepSchema.optional(),
});

export const CreateInstructionSchema = z
  .object({
    enrollment_id: z.number().min(1, "Enrollment is required"),
    title: z.string().min(1, "Title is required").max(180, "Title must not exceed 180 characters"),
    total_days: z.number().min(1, "Total days must be at least 1"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    notes: z.string().optional().nullable().default(""),
    days: z.array(InstructionDaySchema).min(1, "At least one day is required"),
  })
  .refine(
    (data) => {
      if (data.days.length !== data.total_days) {
        return false;
      }
      return true;
    },
    {
      message: "Number of days must match total_days",
      path: ["days"],
    },
  );

export const UpdateInstructionSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(180, "Title must not exceed 180 characters")
      .optional(),
    notes: z.string().optional().nullable(),
    days: z.array(InstructionDaySchema).min(1, "At least one day is required").optional(),
  })
  .partial();

export type CreateInstructionInput = z.infer<typeof CreateInstructionSchema>;
export type UpdateInstructionInput = z.infer<typeof UpdateInstructionSchema>;
export type InstructionDayInput = z.infer<typeof InstructionDaySchema>;
export type InstructionMealInput = z.infer<typeof InstructionMealSchema>;
export type InstructionWorkoutInput = z.infer<typeof InstructionWorkoutSchema>;
export type InstructionActivityInput = z.infer<typeof InstructionActivitySchema>;
export type InstructionWaterInput = z.infer<typeof InstructionWaterSchema>;
export type InstructionSleepInput = z.infer<typeof InstructionSleepSchema>;
