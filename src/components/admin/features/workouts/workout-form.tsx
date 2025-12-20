"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import FileUploadField from "@/components/shared/forms/file-upload-field";
import FormDialog from "@/components/shared/forms/form-dialog";
import InputField from "@/components/shared/forms/input-field";
import SelectField from "@/components/shared/forms/select-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { CreateWorkoutSchema, UpdateWorkoutSchema } from "@/lib/validations/admin/workout-schema";
import { Workout, WorkoutApiResponse, WorkoutFormProperties } from "@/types/admin/workout";
import { WorkoutCategory } from "@/types/admin/workout-category";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function WorkoutForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
}: WorkoutFormProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const isEdit = mode === "edit";

  const { data: categories } = useRequest<WorkoutCategory[]>({
    url: ENDPOINTS.LOOKUP.WORKOUT_CATEGORIES,
    queryKey: ["lookup-workout-categories"],
    staleTime: 1000 * 60 * 5,
  });

  const form = useForm(
    {
      name: "",
      description: "",
      gif: undefined as unknown as File | string,
      video: "",
      equipment: "",
      difficulty: undefined as "beginner" | "intermediate" | "advanced" | undefined,
      workout_category_id: undefined as number | undefined,
    },
    {
      validate: isEdit ? UpdateWorkoutSchema : CreateWorkoutSchema,
      tanstack: {
        invalidateQueries: ["admin-workouts", "admin-workout-categories"],
        mutationOptions: {
          onSuccess: (response) => {
            // Optimistic/UI-first cache update
            form.queryCache.setQueryData<WorkoutApiResponse>(
              ["admin-workouts"],
              (previous) => {
                const base: WorkoutApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as Workout[],
                        message: previous?.message ?? "",
                      } as WorkoutApiResponse);

                const updatedFromServer = (response as WorkoutApiResponse)?.data;
                const baseData = (base?.data as Workout[]) ?? [];

                if (isEdit && defaultValues) {
                  const existing = baseData.find((r) => r.id === defaultValues.id);
                  const next =
                    updatedFromServer ??
                    (existing
                      ? {
                          ...existing,
                          name: String(form.data.name ?? ""),
                          description: String(form.data.description ?? ""),
                          gif: typeof form.data.gif === "string" ? form.data.gif : existing.gif,
                          video:
                            typeof form.data.video === "string" ? form.data.video : existing.video,
                          equipment: String(form.data.equipment ?? ""),
                          difficulty: String(form.data.difficulty ?? "beginner"),
                          category: defaultValues.category,
                        }
                      : undefined);
                  if (!next) return base;
                  return {
                    ...base,
                    data: baseData.map((r) => (r.id === defaultValues.id ? next : r)),
                  } as WorkoutApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return {
                    ...base,
                    data: [updatedFromServer, ...baseData],
                  } as WorkoutApiResponse;
                }

                return base as WorkoutApiResponse;
              },
              { all: true },
            );

            if (!isEdit) {
              const url = buildDefaultListUrl(pathname, searchParameters);
              router.replace(url, { scroll: false });
            }

            handleDialogOpenChange(false);
            toast.success(response.message);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      },
    },
  );

  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);

    if (!value) form.reset();
  };

  const buildFormData = (payload: typeof form.data) => {
    const fd = new FormData();
    fd.append("name", String(payload.name ?? ""));
    fd.append("description", String(payload.description ?? ""));
    fd.append("difficulty", String(payload.difficulty ?? "beginner"));
    fd.append("equipment", String(payload.equipment ?? ""));
    fd.append("video", String(payload.video ?? ""));
    fd.append("workout_category_id", String(payload.workout_category_id ?? 0));

    if (payload.gif instanceof File) {
      fd.append("gif", payload.gif);
    }

    return fd;
  };

  useEffect(() => {
    if (isEdit && defaultValues) {
      const newData = {
        workout_category_id: defaultValues.category?.id ?? 0,
        name: defaultValues.name ?? "",
        description: defaultValues.description ?? "",
        gif: defaultValues.gif ?? undefined,
        video: defaultValues.video ?? "",
        equipment: defaultValues.equipment ?? "",
        difficulty:
          defaultValues.difficulty ?? ("beginner" as "beginner" | "intermediate" | "advanced"),
      };
      form.setDataAndDefaults(newData);
    } else {
      const newData = {
        name: "",
        description: "",
        gif: undefined as File | string | undefined,
        video: "",
        equipment: "",
        difficulty: "beginner" as "beginner" | "intermediate" | "advanced",
        workout_category_id: 0,
      };

      form.setDataAndDefaults(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultValues?.id,
    defaultValues?.name,
    defaultValues?.description,
    defaultValues?.gif,
    defaultValues?.video,
    defaultValues?.equipment,
    defaultValues?.difficulty,
    defaultValues?.category?.id,
    isEdit,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.WORKOUTS.UPDATE(defaultValues.id), {
        transform: buildFormData,
      });
    } else {
      form.post(ENDPOINTS.ADMIN.WORKOUTS.STORE, { transform: buildFormData });
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={isEdit ? "Edit Workout" : "Create New Workout"}
      description={
        isEdit
          ? "Update this workout's details, category, difficulty, equipment, or multimedia resources to keep your exercise library accurate and up-to-date."
          : "Add a new workout with name, description, category, difficulty level, equipment requirements, and optional GIF or video resources to expand your exercise database."
      }
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Workout"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Workout..."}
      disabled={isEdit && !form.isDirty}
    >
      {/* Category */}
      <ComboBoxField
        id="workout_category_id"
        name="workout_category_id"
        label="Category"
        placeholder="Select a workout category..."
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found."
        options={
          Array.isArray(categories?.data) && categories !== undefined
            ? categories.data.map((category: WorkoutCategory) => ({
                value: String(category.id),
                label: category.name,
              }))
            : []
        }
        value={
          form.data.workout_category_id === undefined ? "" : String(form.data.workout_category_id)
        }
        onChange={(value: string) => {
          form.setData("workout_category_id", value === "" ? undefined : Number(value));
        }}
        error={form.errors.workout_category_id as string}
        required
        disabled={form.processing || !categories}
        allowClear={true}
      />

      {/* Name */}
      <InputField
        id="name"
        name="name"
        type="text"
        value={String(form.data.name ?? "")}
        onChange={(event) => form.setData("name", event.target.value)}
        error={form.errors.name as string}
        label="Name"
        placeholder="e.g., Push-ups, Squats, Plank, Deadlift, Bench Press"
        required
        disabled={form.processing}
      />
      {/* Description */}
      <TextareaField
        id="description"
        name="description"
        value={String(form.data.description ?? "")}
        onChange={(event) => form.setData("description", event.target.value)}
        error={form.errors.description as string}
        label="Description"
        placeholder="Enter a detailed description of the workout exercise, including proper form, target muscles, and execution steps..."
        disabled={form.processing}
      />
      {/* GIF Upload */}
      <FileUploadField
        id="gif"
        label="GIF"
        value={form.data.gif}
        onChange={(file) => form.setData("gif", file as File | undefined)}
        maxSize={5 * 1024 * 1024}
        accept="image/jpg,image/jpeg,image/png,image/webp"
        required={!isEdit}
        error={form.errors.gif as string}
      />

      <InputField
        id="video"
        name="video"
        type="text"
        value={String(form.data.video ?? "")}
        onChange={(event) => form.setData("video", event.target.value)}
        error={form.errors.video as string}
        label="Video URL"
        placeholder="e.g., https://youtube.com/watch?v=..., https://vimeo.com/..., or direct video URL"
        disabled={form.processing}
      />

      {/* Equipment */}
      <InputField
        id="equipment"
        name="equipment"
        type="text"
        value={String(form.data.equipment ?? "")}
        onChange={(event) => form.setData("equipment", event.target.value)}
        error={form.errors.equipment as string}
        label="Equipment"
        placeholder="e.g., Dumbbells, Barbell, Resistance Bands, None (Bodyweight)"
        disabled={form.processing}
      />

      {/* Difficulty */}
      <SelectField
        id="difficulty"
        name="difficulty"
        label="Difficulty"
        value={String(form.data.difficulty ?? "beginner")}
        placeholder="Select difficulty level..."
        onChange={(value) =>
          form.setData("difficulty", value as "beginner" | "intermediate" | "advanced")
        }
        error={form.errors.difficulty as string}
        options={[
          { label: "Beginner", value: "beginner" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Advanced", value: "advanced" },
        ]}
        disabled={form.processing}
      />
    </FormDialog>
  );
}
