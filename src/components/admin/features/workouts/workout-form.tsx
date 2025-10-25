"use client";

import { Dumbbell } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import { ComboBoxField } from "@/components/shared/forms/combo-box-field";
import { FormDialog } from "@/components/shared/forms/form-dialog";
import { InputField } from "@/components/shared/forms/input-field";
import { TextareaField } from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { WorkoutSchema } from "@/lib/validations/admin/workout-schema";
import { Workout, WorkoutApiResponse, WorkoutFormProperties } from "@/types/admin/workout";
import { WorkoutCategory, WorkoutCategoryApiResponse } from "@/types/admin/workout-category";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function WorkoutForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
}: WorkoutFormProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const isEdit = mode === "edit";

  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);

    if (!value) form.reset();
  };

  // Fetch metadata
  const { data: categories } = useRequest<WorkoutCategoryApiResponse>({
    url: ENDPOINTS.META.WORKOUT_CATEGORIES,
    queryKey: ["meta-workout-categories"],
    staleTime: 1000 * 60 * 5,
  });

  type Difficulty = "beginner" | "intermediate" | "advanced";

  const difficultyOptions: { value: Difficulty; label: string }[] = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];

  const form = useForm(
    {
      workout_category_id: "",
      name: "",
      description: "",
      difficulty: "beginner",
      equipment: "",
      gif_path: "",
      video_url: "",
    },
    {
      validate: WorkoutSchema,
      tanstack: {
        invalidateQueries: ["admin-workouts", "meta-workout-categories"],
        mutationOptions: {
          onSuccess: (response) => {
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
                          name: form.data.name,
                          description: form.data.description,
                          difficulty: form.data.difficulty,
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
          onError: (error) => toast.error(error.message),
        },
      },
    },
  );

  useEffect(() => {
    if (dialogOpen) {
      // <- run whenever dialog opens
      if (isEdit && defaultValues) {
        form.setData({
          workout_category_id: defaultValues.category?.id ?? "",
          name: defaultValues.name ?? "",
          description: defaultValues.description ?? "",
          difficulty: defaultValues.difficulty ?? "beginner",
          equipment: defaultValues.equipment ?? "",
          gif_path: defaultValues.gif_path ?? "",
          video_url: defaultValues.video_url ?? "",
        });
      } else {
        form.setData({
          workout_category_id: "",
          name: "",
          description: "",
          difficulty: "beginner",
          equipment: "",
          gif_path: "",
          video_url: "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen, defaultValues]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.WORKOUTS.UPDATE(defaultValues.id));
    } else {
      form.post(ENDPOINTS.ADMIN.WORKOUTS.STORE);
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={title ?? (isEdit ? "Edit Workout" : "Create a New Workout")}
      description={
        description ??
        (isEdit
          ? "Edit workout details. Changes will update schedules and logs."
          : "Create a workout with name, category, difficulty, and description.")
      }
      icon={<Dumbbell className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Workout"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Workout"}
    >
      {/* Workout Category */}
      <ComboBoxField
        id="workout_category_id"
        name="workout_category_id"
        label="Category"
        placeholder="Select a category..."
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found."
        options={
          Array.isArray(categories?.data)
            ? categories.data.map((category: WorkoutCategory) => ({
                value: String(category.id),
                label: category.name,
              }))
            : []
        }
        value={String(form.data.workout_category_id ?? "")}
        onChange={(value: string) => form.setData("workout_category_id", value)}
        error={form.errors.workout_category_id as string}
        required
        disabled={form.processing}
        allowClear
      />

      {/* Name */}
      <InputField
        id="name"
        name="name"
        type="text"
        value={form.data.name ?? ""}
        onChange={(event) => form.setData("name", event.target.value)}
        error={form.errors.name as string}
        label="Name"
        placeholder="e.g., Push-ups"
        required
        disabled={form.processing}
      />

      {/* Description */}
      <TextareaField
        id="description"
        name="description"
        value={form.data.description ?? ""}
        onChange={(event) => form.setData("description", event.target.value)}
        error={form.errors.description as string}
        label="Description"
        placeholder="Describe the workout"
        disabled={form.processing}
      />

      {/* Equipment */}
      <InputField
        id="equipment"
        name="equipment"
        type="text"
        value={form.data.equipment ?? ""}
        onChange={(event) => form.setData("equipment", event.target.value)}
        error={form.errors.equipment as string}
        label="Equipment"
        placeholder="e.g., Dumbbells, Mat, or None"
        disabled={form.processing}
      />

      {/* GIF Upload */}
      <InputField
        id="gif_path"
        name="gif_path"
        type="url"
        value={form.data.gif_path ?? ""}
        onChange={(event) => form.setData("gif_path", event.target.value)}
        error={form.errors.gif_path as string}
        label="GIF URL"
        placeholder="Enter the GIF URL or path"
        disabled={form.processing}
      />

      {/* Video URL */}
      <InputField
        id="video_url"
        name="video_url"
        type="url"
        value={form.data.video_url ?? ""}
        onChange={(event) => form.setData("video_url", event.target.value)}
        error={form.errors.video_url as string}
        label="Video URL"
        placeholder="Paste YouTube or video link"
        disabled={form.processing}
      />

      {/* Difficulty */}
      <ComboBoxField
        id="difficulty"
        name="difficulty"
        label="Difficulty"
        placeholder="Select difficulty..."
        searchPlaceholder="Search difficulty..."
        emptyMessage="No options found"
        options={difficultyOptions}
        value={form.data.difficulty}
        onChange={(value: string) => {
          if (difficultyOptions.some((opt) => opt.value === value)) {
            form.setData("difficulty", value as Difficulty);
          }
        }}
        error={form.errors.difficulty as string}
        required
        disabled={form.processing}
        allowClear
      />
    </FormDialog>
  );
}
