/* eslint-disable unicorn/no-null */
"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import DatepickerField from "@/components/shared/forms/datepicker-field";
import InputField from "@/components/shared/forms/input-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useForm } from "@/hooks/use-form";
import {
  type CreateInstructionInput,
  CreateInstructionSchema,
  type InstructionActivityInput,
  type InstructionDayInput,
  type InstructionMealInput,
  type InstructionWorkoutInput,
  UpdateInstructionSchema,
} from "@/lib/validations/admin/instruction-schema";
import { Instruction as InstructionType, InstructionApiResponse } from "@/types/admin/instruction";

export default function InstructionForm({ instruction }: { instruction?: InstructionType }) {
  const isEdit = Boolean(instruction);
  const router = useRouter();

  // Build initial data from props
  const mappedFromProperties: CreateInstructionInput | null = React.useMemo(() => {
    if (!instruction) return null;

    const days: CreateInstructionInput["days"] = Array.isArray(instruction.days)
      ? instruction.days.map((day) => ({
          id: day.id,
          day_number: day.day_number,
          date: day.date,
          notes: day.notes || "",
          meals: Array.isArray(day.meals)
            ? day.meals.map((meal) => ({
                id: meal.id,
                meal_slot_id: meal.slot.id,
                calorie_target: meal.calorie_target,
                notes: meal.notes || "",
              }))
            : [],
          workouts: Array.isArray(day.workouts)
            ? day.workouts.map((workout) => ({
                id: workout.id,
                workout_id: workout.exercise.id,
                sets: workout.sets,
                reps: workout.reps,
                duration_min: workout.duration_min,
                notes: workout.notes || "",
              }))
            : [],
          activities: Array.isArray(day.activities)
            ? day.activities.map((activity) => ({
                id: activity.id,
                activity_id: activity.activity.id,
                target_value: activity.target_value,
                notes: activity.notes || "",
              }))
            : [],
          water: day.water
            ? {
                target_ml: day.water.target_ml,
                notes: day.water.notes || "",
              }
            : undefined,
          sleep: day.sleep
            ? {
                target_hours: Number.parseFloat(day.sleep.target_hours) || 0,
                notes: day.sleep.notes || "",
              }
            : undefined,
        }))
      : [];

    return {
      enrollment_id: instruction.enrollment.id,
      title: instruction.title,
      total_days: instruction.total_days,
      start_date: instruction.start_date,
      end_date: instruction.end_date,
      notes: instruction.notes || "",
      days,
    } as CreateInstructionInput;
  }, [instruction]);

  const form = useForm(
    mappedFromProperties ?? {
      enrollment_id: 0,
      title: "",
      total_days: 1,
      start_date: "",
      end_date: "",
      notes: "",
      days: [
        {
          day_number: 1,
          date: "",
          notes: "",
          meals: [],
          workouts: [],
          activities: [],
          water: { target_ml: 0, notes: "" },
          sleep: { target_hours: 0, notes: "" },
        },
      ],
    },
    {
      validate: isEdit ? UpdateInstructionSchema : CreateInstructionSchema,
      tanstack: {
        invalidateQueries: ["admin-instructions", "admin-instruction"],
        mutationOptions: {
          onSuccess: (response) => {
            // Optimistically update list cache
            form.queryCache.setQueryData<InstructionApiResponse>(
              ["admin-instructions"],
              (previous) => {
                const base: InstructionApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as InstructionType[],
                        message: (previous as { message?: string } | undefined)?.message ?? "",
                      } as InstructionApiResponse);

                const updatedFromServer = (
                  response as unknown as {
                    data?: InstructionType | InstructionType[];
                  }
                ).data as InstructionType | InstructionType[] | undefined;
                const baseData = ((base?.data as InstructionType[]) ?? []) as InstructionType[];

                if (isEdit && instruction?.id) {
                  const nextInstruction = Array.isArray(updatedFromServer)
                    ? updatedFromServer[0]
                    : (updatedFromServer as InstructionType | undefined);
                  const existing = baseData.find((index) => index.id === instruction.id);
                  const merged =
                    nextInstruction ??
                    (existing
                      ? {
                          ...existing,
                          title: String(form.data.title ?? ""),
                          notes: String(form.data.notes ?? ""),
                        }
                      : undefined);
                  if (!merged) return base;
                  return {
                    ...base,
                    data: baseData.map((index) => (index.id === instruction.id ? merged : index)),
                  } as InstructionApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  const created = Array.isArray(updatedFromServer)
                    ? updatedFromServer[0]
                    : (updatedFromServer as InstructionType);
                  return { ...base, data: [created, ...baseData] } as InstructionApiResponse;
                }

                return base as InstructionApiResponse;
              },
              { all: true },
            );

            // Update the specific instruction cache too if available
            if (isEdit && instruction?.id) {
              form.queryCache.setQueryData(
                ["admin-instruction", String(instruction.id)],
                (previous) => {
                  const nextInstruction = (
                    response as unknown as {
                      data?: InstructionType | InstructionType[];
                    }
                  )?.data;
                  if (!nextInstruction) return previous;
                  return {
                    status: "success",
                    message: (previous as { message?: string } | undefined)?.message ?? "",
                    data: Array.isArray(nextInstruction) ? nextInstruction[0] : nextInstruction,
                  } as unknown;
                },
              );
            }

            router.push(PATHS.ADMIN.INSTRUCTIONS.LIST);
            toast.success(response.message);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      },
    },
  );

  const [openDays, setOpenDays] = React.useState<boolean[]>([true]);

  // Update openDays when days change
  React.useEffect(() => {
    const length = Array.isArray(form.data.days) ? form.data.days.length : 0;
    setOpenDays((previous) => {
      const next = [...previous];
      while (next.length < length) next.push(true);
      if (next.length > length) next.length = length;
      return next;
    });
  }, [form.data.days]);

  // Calculate dates when start_date or total_days changes
  React.useEffect(() => {
    if (
      !isEdit &&
      form.data.start_date &&
      typeof form.data.start_date === "string" &&
      form.data.total_days &&
      typeof form.data.total_days === "number"
    ) {
      const startDate = new Date(form.data.start_date);
      if (!Number.isNaN(startDate.getTime())) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + form.data.total_days - 1);
        const endDateString = endDate.toISOString().split("T")[0];
        if (endDateString !== form.data.end_date) {
          form.setData("end_date", endDateString);
        }

        // Update days array
        const days: InstructionDayInput[] = [];
        for (let index = 0; index < form.data.total_days; index++) {
          const dayDate = new Date(startDate);
          dayDate.setDate(dayDate.getDate() + index);
          const dayDateString = dayDate.toISOString().split("T")[0];

          const existingDay = form.data.days?.[index];
          days.push({
            id: existingDay?.id,
            day_number: index + 1,
            date: dayDateString,
            notes: existingDay?.notes || "",
            meals: existingDay?.meals || [],
            workouts: existingDay?.workouts || [],
            activities: existingDay?.activities || [],
            water: existingDay?.water || { target_ml: 0, notes: "" },
            sleep: existingDay?.sleep || { target_hours: 0, notes: "" },
          });
        }
        form.setData("days", days);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.data.start_date, form.data.total_days, isEdit]);

  // Placeholder options - these should be fetched from API
  const enrollmentOptions = [
    { value: "1", label: "Enrollment #1" },
    { value: "2", label: "Enrollment #2" },
  ];

  const mealSlotOptions = [
    { value: "1", label: "Breakfast" },
    { value: "2", label: "Lunch" },
    { value: "3", label: "Dinner" },
    { value: "4", label: "Snack" },
  ];

  const workoutOptions = [
    { value: "1", label: "Push-ups" },
    { value: "2", label: "Squats" },
    { value: "3", label: "Running" },
  ];

  const activityOptions = [
    { value: "1", label: "Steps" },
    { value: "2", label: "Cycling" },
    { value: "3", label: "Swimming" },
  ];

  const addMeal = (dayIndex: number) => {
    const days = [...(form.data.days || [])];
    const day = days[dayIndex];
    if (!day) return;
    day.meals = [...(day.meals || []), { meal_slot_id: 0, calorie_target: 0, notes: "" }];
    form.setData("days", days);
  };

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    const days = [...(form.data.days || [])];
    const day = days[dayIndex];
    if (!day || !day.meals) return;
    day.meals.splice(mealIndex, 1);
    form.setData("days", days);
  };

  const addWorkout = (dayIndex: number) => {
    const days = [...(form.data.days || [])];
    const day = days[dayIndex];
    if (!day) return;
    day.workouts = [
      ...(day.workouts || []),
      { workout_id: 0, sets: null, reps: null, duration_min: null, notes: "" },
    ];
    form.setData("days", days);
  };

  const removeWorkout = (dayIndex: number, workoutIndex: number) => {
    const days = [...(form.data.days || [])];
    const day = days[dayIndex];
    if (!day || !day.workouts) return;
    day.workouts.splice(workoutIndex, 1);
    form.setData("days", days);
  };

  const addActivity = (dayIndex: number) => {
    const days = [...(form.data.days || [])];
    const day = days[dayIndex];
    if (!day) return;
    day.activities = [...(day.activities || []), { activity_id: 0, target_value: 0, notes: "" }];
    form.setData("days", days);
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const days = [...(form.data.days || [])];
    const day = days[dayIndex];
    if (!day || !day.activities) return;
    day.activities.splice(activityIndex, 1);
    form.setData("days", days);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEdit && instruction?.id) {
      // For update, only send title, notes, and days
      const updateData = {
        title: form.data.title,
        notes: form.data.notes,
        days: (form.data.days || []).map((day) => ({
          id: day.id,
          day_number: day.day_number,
          date: day.date,
          notes: day.notes,
          meals: day.meals.map((meal) => ({
            id: meal.id,
            meal_slot_id: meal.meal_slot_id,
            calorie_target: meal.calorie_target,
            notes: meal.notes,
          })),
          workouts: day.workouts.map((workout) => ({
            id: workout.id,
            workout_id: workout.workout_id,
            sets: workout.sets,
            reps: workout.reps,
            duration_min: workout.duration_min,
            notes: workout.notes,
          })),
          activities: day.activities.map((activity) => ({
            id: activity.id,
            activity_id: activity.activity_id,
            target_value: activity.target_value,
            notes: activity.notes,
          })),
          water: day.water
            ? {
                target_ml: day.water.target_ml,
                notes: day.water.notes,
              }
            : undefined,
          sleep: day.sleep
            ? {
                target_hours: day.sleep.target_hours,
                notes: day.sleep.notes,
              }
            : undefined,
        })),
      };
      // Set the update data and then submit
      form.setData(updateData);
      form.put(ENDPOINTS.ADMIN.INSTRUCTIONS.UPDATE(instruction.id), {
        transform: () => updateData,
      });
    } else {
      form.post(ENDPOINTS.ADMIN.INSTRUCTIONS.STORE);
    }
  };

  return (
    <div className="mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-md border border-gray-200 p-6">
        {/* Basic Information */}
        <div className="space-y-5">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-gray-800">
              Basic Information
            </h3>
            <p className="text-sm text-gray-500">
              Provide the essential details for this instruction.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ComboBoxField
              id="enrollment_id"
              label="Enrollment"
              placeholder="Select enrollment"
              options={enrollmentOptions}
              value={String(form.data.enrollment_id || "")}
              onChange={(value) => form.setData("enrollment_id", Number.parseInt(value, 10))}
              error={form.errors.enrollment_id as string}
              required
              disabled={isEdit}
            />
            <InputField
              id="title"
              name="title"
              label="Title"
              placeholder="e.g., Weight Loss Transformation Program"
              value={String(form.data.title ?? "")}
              onChange={(event_) => form.setData("title", event_.target.value)}
              error={form.errors.title as string}
              required
            />
            {!isEdit && (
              <>
                <InputField
                  id="total_days"
                  name="total_days"
                  label="Total Days"
                  type="number"
                  min={1}
                  value={String(form.data.total_days ?? 1)}
                  onChange={(event_) =>
                    form.setData("total_days", Number.parseInt(event_.target.value, 10) || 1)
                  }
                  error={form.errors.total_days as string}
                  required
                />
                <DatepickerField
                  id="start_date"
                  label="Start Date"
                  value={
                    typeof form.data.start_date === "string" ? form.data.start_date : undefined
                  }
                  onChange={(value) => form.setData("start_date", value || "")}
                  error={form.errors.start_date as string}
                  required
                />
              </>
            )}
            <TextareaField
              id="notes"
              name="notes"
              label="Notes"
              placeholder="Additional notes about this instruction"
              className="min-h-[92px] md:col-span-2"
              value={String(form.data.notes ?? "")}
              onChange={(event_) => form.setData("notes", event_.target.value)}
              error={form.errors.notes as string}
            />
          </div>
        </div>

        <Separator />

        {/* Days */}
        <div className="space-y-5">
          <div>
            <h3 className="text-[15px] font-semibold tracking-tight text-gray-800">Days</h3>
            <p className="text-sm text-gray-500">
              Configure meals, workouts, activities, water, and sleep for each day.
            </p>
          </div>

          {(Array.isArray(form.data.days) ? form.data.days : []).map(
            (day: InstructionDayInput, dayIndex: number) => (
              <Collapsible
                key={dayIndex}
                open={openDays[dayIndex] ?? true}
                onOpenChange={(value) => {
                  setOpenDays((previous) => {
                    const next = [...previous];
                    next[dayIndex] = Boolean(value);
                    return next;
                  });
                }}
                className="overflow-hidden rounded-md border border-gray-200"
              >
                <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
                  <div className="text-sm font-semibold">
                    Day {day.day_number} - {day.date}
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" aria-label="Toggle day">
                      {(openDays[dayIndex] ?? true) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="space-y-4 px-4 py-5">
                    <TextareaField
                      id={`day-${dayIndex}-notes`}
                      label="Day Notes"
                      placeholder="Notes for this day"
                      value={String(day.notes ?? "")}
                      onChange={(event_) => {
                        const days = [...(form.data.days || [])];
                        days[dayIndex].notes = event_.target.value;
                        form.setData("days", days);
                      }}
                      error={form.errors[`days.${dayIndex}.notes`] as string}
                    />

                    <Separator />

                    {/* Meals */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Meals</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addMeal(dayIndex)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/10 flex cursor-pointer items-center gap-2"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Meal
                        </Button>
                      </div>
                      {(day.meals || []).map((meal: InstructionMealInput, mealIndex: number) => (
                        <div key={mealIndex} className="space-y-3 rounded-md border p-3">
                          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <ComboBoxField
                              id={`day-${dayIndex}-meal-${mealIndex}-slot`}
                              label="Meal Slot"
                              placeholder="Select meal slot"
                              options={mealSlotOptions}
                              value={String(meal.meal_slot_id || "")}
                              onChange={(value) => {
                                const days = [...(form.data.days || [])];
                                days[dayIndex].meals[mealIndex].meal_slot_id = Number.parseInt(
                                  value,
                                  10,
                                );
                                form.setData("days", days);
                              }}
                              required
                            />
                            <InputField
                              id={`day-${dayIndex}-meal-${mealIndex}-calories`}
                              label="Calorie Target"
                              type="number"
                              min={0}
                              value={String(meal.calorie_target || 0)}
                              onChange={(event_) => {
                                const days = [...(form.data.days || [])];
                                days[dayIndex].meals[mealIndex].calorie_target =
                                  Number.parseInt(event_.target.value, 10) || 0;
                                form.setData("days", days);
                              }}
                              required
                            />
                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeMeal(dayIndex, mealIndex)}
                                className="hover:bg-destructive/10 hover:text-destructive"
                                aria-label="Remove meal"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <TextareaField
                            id={`day-${dayIndex}-meal-${mealIndex}-notes`}
                            label="Meal Notes"
                            placeholder="Notes for this meal"
                            value={String(meal.notes ?? "")}
                            onChange={(event_) => {
                              const days = [...(form.data.days || [])];
                              days[dayIndex].meals[mealIndex].notes = event_.target.value;
                              form.setData("days", days);
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Workouts */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Workouts</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addWorkout(dayIndex)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/10 flex cursor-pointer items-center gap-2"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Workout
                        </Button>
                      </div>
                      {(day.workouts || []).map(
                        (workout: InstructionWorkoutInput, workoutIndex: number) => (
                          <div key={workoutIndex} className="space-y-3 rounded-md border p-3">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                              <ComboBoxField
                                id={`day-${dayIndex}-workout-${workoutIndex}-exercise`}
                                label="Exercise"
                                placeholder="Select exercise"
                                options={workoutOptions}
                                value={String(workout.workout_id || "")}
                                onChange={(value) => {
                                  const days = [...(form.data.days || [])];
                                  days[dayIndex].workouts[workoutIndex].workout_id =
                                    Number.parseInt(value, 10);
                                  form.setData("days", days);
                                }}
                                required
                              />
                              <InputField
                                id={`day-${dayIndex}-workout-${workoutIndex}-sets`}
                                label="Sets"
                                type="number"
                                min={1}
                                value={workout.sets ? String(workout.sets) : ""}
                                onChange={(event_) => {
                                  const days = [...(form.data.days || [])];
                                  days[dayIndex].workouts[workoutIndex].sets = event_.target.value
                                    ? Number.parseInt(event_.target.value, 10)
                                    : null;
                                  form.setData("days", days);
                                }}
                                placeholder="Optional"
                              />
                              <InputField
                                id={`day-${dayIndex}-workout-${workoutIndex}-reps`}
                                label="Reps"
                                type="number"
                                min={1}
                                value={workout.reps ? String(workout.reps) : ""}
                                onChange={(event_) => {
                                  const days = [...(form.data.days || [])];
                                  days[dayIndex].workouts[workoutIndex].reps = event_.target.value
                                    ? Number.parseInt(event_.target.value, 10)
                                    : null;
                                  form.setData("days", days);
                                }}
                                placeholder="Optional"
                              />
                              <div className="flex items-end gap-2">
                                <InputField
                                  id={`day-${dayIndex}-workout-${workoutIndex}-duration`}
                                  label="Duration (min)"
                                  type="number"
                                  min={1}
                                  value={workout.duration_min ? String(workout.duration_min) : ""}
                                  onChange={(event_) => {
                                    const days = [...(form.data.days || [])];
                                    days[dayIndex].workouts[workoutIndex].duration_min = event_
                                      .target.value
                                      ? Number.parseInt(event_.target.value, 10)
                                      : null;
                                    form.setData("days", days);
                                  }}
                                  placeholder="Optional"
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeWorkout(dayIndex, workoutIndex)}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                  aria-label="Remove workout"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <TextareaField
                              id={`day-${dayIndex}-workout-${workoutIndex}-notes`}
                              label="Workout Notes"
                              placeholder="Notes for this workout"
                              value={String(workout.notes ?? "")}
                              onChange={(event_) => {
                                const days = [...(form.data.days || [])];
                                days[dayIndex].workouts[workoutIndex].notes = event_.target.value;
                                form.setData("days", days);
                              }}
                            />
                          </div>
                        ),
                      )}
                    </div>

                    <Separator />

                    {/* Activities */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Activities</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => addActivity(dayIndex)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/10 flex cursor-pointer items-center gap-2"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Activity
                        </Button>
                      </div>
                      {(day.activities || []).map(
                        (activity: InstructionActivityInput, activityIndex: number) => (
                          <div key={activityIndex} className="space-y-3 rounded-md border p-3">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                              <ComboBoxField
                                id={`day-${dayIndex}-activity-${activityIndex}-type`}
                                label="Activity"
                                placeholder="Select activity"
                                options={activityOptions}
                                value={String(activity.activity_id || "")}
                                onChange={(value) => {
                                  const days = [...(form.data.days || [])];
                                  days[dayIndex].activities[activityIndex].activity_id =
                                    Number.parseInt(value, 10);
                                  form.setData("days", days);
                                }}
                                required
                              />
                              <InputField
                                id={`day-${dayIndex}-activity-${activityIndex}-target`}
                                label="Target Value"
                                type="number"
                                min={0}
                                value={String(activity.target_value || 0)}
                                onChange={(event_) => {
                                  const days = [...(form.data.days || [])];
                                  days[dayIndex].activities[activityIndex].target_value =
                                    Number.parseInt(event_.target.value, 10) || 0;
                                  form.setData("days", days);
                                }}
                                required
                              />
                              <div className="flex items-end">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeActivity(dayIndex, activityIndex)}
                                  className="hover:bg-destructive/10 hover:text-destructive"
                                  aria-label="Remove activity"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <TextareaField
                              id={`day-${dayIndex}-activity-${activityIndex}-notes`}
                              label="Activity Notes"
                              placeholder="Notes for this activity"
                              value={String(activity.notes ?? "")}
                              onChange={(event_) => {
                                const days = [...(form.data.days || [])];
                                days[dayIndex].activities[activityIndex].notes =
                                  event_.target.value;
                                form.setData("days", days);
                              }}
                            />
                          </div>
                        ),
                      )}
                    </div>

                    <Separator />

                    {/* Water & Sleep */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-3 rounded-md border p-3">
                        <Label className="text-sm font-semibold">Water</Label>
                        <InputField
                          id={`day-${dayIndex}-water-target`}
                          label="Target (ml)"
                          type="number"
                          min={0}
                          value={String(day.water?.target_ml || 0)}
                          onChange={(event_) => {
                            const days = [...(form.data.days || [])];
                            if (!days[dayIndex].water) {
                              days[dayIndex].water = { target_ml: 0, notes: "" };
                            }
                            days[dayIndex].water!.target_ml =
                              Number.parseInt(event_.target.value, 10) || 0;
                            form.setData("days", days);
                          }}
                          required
                        />
                        <TextareaField
                          id={`day-${dayIndex}-water-notes`}
                          label="Water Notes"
                          placeholder="Notes for water intake"
                          value={String(day.water?.notes || "")}
                          onChange={(event_) => {
                            const days = [...(form.data.days || [])];
                            if (!days[dayIndex].water) {
                              days[dayIndex].water = { target_ml: 0, notes: "" };
                            }
                            days[dayIndex].water!.notes = event_.target.value;
                            form.setData("days", days);
                          }}
                        />
                      </div>
                      <div className="space-y-3 rounded-md border p-3">
                        <Label className="text-sm font-semibold">Sleep</Label>
                        <InputField
                          id={`day-${dayIndex}-sleep-target`}
                          label="Target (hours)"
                          type="number"
                          min={0}
                          max={24}
                          step={0.5}
                          value={String(day.sleep?.target_hours || 0)}
                          onChange={(event_) => {
                            const days = [...(form.data.days || [])];
                            if (!days[dayIndex].sleep) {
                              days[dayIndex].sleep = { target_hours: 0, notes: "" };
                            }
                            days[dayIndex].sleep!.target_hours =
                              Number.parseFloat(event_.target.value) || 0;
                            form.setData("days", days);
                          }}
                          required
                        />
                        <TextareaField
                          id={`day-${dayIndex}-sleep-notes`}
                          label="Sleep Notes"
                          placeholder="Notes for sleep"
                          value={String(day.sleep?.notes || "")}
                          onChange={(event_) => {
                            const days = [...(form.data.days || [])];
                            if (!days[dayIndex].sleep) {
                              days[dayIndex].sleep = { target_hours: 0, notes: "" };
                            }
                            days[dayIndex].sleep!.notes = event_.target.value;
                            form.setData("days", days);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ),
          )}
        </div>

        <Separator className="my-5" />

        <div className="flex items-center justify-end">
          <Button
            type="submit"
            disabled={form.processing || (isEdit && !form.isDirty)}
            className="flex cursor-pointer items-center gap-2 font-semibold"
          >
            {form.processing
              ? isEdit
                ? "Saving Changes..."
                : "Creating Instruction..."
              : isEdit
                ? "Save Changes"
                : "Create Instruction"}
          </Button>
        </div>
      </form>
    </div>
  );
}
