"use client";

import { FolderKanban } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import { ComboBoxField } from "@/components/shared/forms/combo-box-field";
import FormDialog from "@/components/shared/forms/form-dialog";
import InputField from "@/components/shared/forms/input-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import {
  CreateWorkoutCategorySchema,
  UpdateWorkoutCategorySchema,
} from "@/lib/validations/admin/workout-category-schema";
import {
  WorkoutCategory,
  WorkoutCategoryApiResponse,
  WorkoutCategoryFormProperties,
} from "@/types/admin/workout-category";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function WorkoutCategoryForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
}: WorkoutCategoryFormProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const isEdit = mode === "edit";

  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setUncontrolledOpen(value);
    }

    if (!value) {
      form.reset();
    }
  };

  const { data: workoutCategories } = useRequest({
    url: ENDPOINTS.META.WORKOUT_CATEGORIES,
    queryKey: ["meta-workout-categories"],
    data: { only: "parent" },
    staleTime: 1000 * 60 * 5,
  });

  const form = useForm(
    {
      parent_id: "",
      name: "",
      description: "",
    },
    {
      validate: isEdit ? UpdateWorkoutCategorySchema : CreateWorkoutCategorySchema,
      tanstack: {
        invalidateQueries: ["admin-workout-categories", "meta-workout-categories"],
        mutationOptions: {
          onSuccess: (response) => {
            form.queryCache.setQueryData<WorkoutCategoryApiResponse>(
              ["admin-workout-categories"],
              (previous) => {
                const base: WorkoutCategoryApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as WorkoutCategory[],
                        message: previous?.message ?? "",
                      } as WorkoutCategoryApiResponse);

                const updatedFromServer = (response as WorkoutCategoryApiResponse)?.data;
                const baseData = (base?.data as WorkoutCategory[]) ?? [];

                if (isEdit && defaultValues) {
                  const existing = baseData.find((r) => r.id === defaultValues.id);
                  const next =
                    updatedFromServer ??
                    (existing
                      ? {
                          ...existing,
                          name: String(form.data.name ?? ""),
                          description: String(form.data.description ?? ""),
                          parent: defaultValues.parent,
                        }
                      : undefined);
                  if (!next) return base;
                  return {
                    ...base,
                    data: baseData.map((r) => (r.id === defaultValues.id ? next : r)),
                  } as WorkoutCategoryApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return {
                    ...base,
                    data: [updatedFromServer, ...baseData],
                  } as WorkoutCategoryApiResponse;
                }
                return base as WorkoutCategoryApiResponse;
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

  useEffect(() => {
    if (isEdit && defaultValues) {
      const newData = {
        parent_id: defaultValues.parent?.id ?? "",
        name: defaultValues.name ?? "",
        description: defaultValues.description ?? "",
      };

      form.setDataAndDefaults(newData);
    } else {
      const newData = {
        parent_id: "",
        name: "",
        description: "",
      };

      form.setDataAndDefaults(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultValues?.id,
    defaultValues?.parent?.id,
    defaultValues?.name,
    defaultValues?.description,
    isEdit,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.WORKOUT_CATEGORIES.UPDATE(defaultValues.id));
    } else {
      form.post(ENDPOINTS.ADMIN.WORKOUT_CATEGORIES.STORE);
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={title ?? (isEdit ? "Edit Workout Category" : "Create a New Workout Category")}
      description={
        description ??
        (isEdit
          ? "Edit the name, parent, or description of this workout category. Changes will update how workouts are organized."
          : "Create a workout category with a name, optional parent, and description to organize your workouts.")
      }
      icon={<FolderKanban className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Workout Category"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Workout Category..."}
      disabled={isEdit && !form.isDirty}
    >
      {/* Parent Category Field */}
      <ComboBoxField
        id="parent_id"
        name="parent_id"
        label="Parent Category"
        description="Select a parent category if this is a subcategory"
        placeholder="Select parent category..."
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found."
        options={[
          { value: "", label: "No parent (Root category)" },
          ...(Array.isArray(workoutCategories?.data) && workoutCategories !== undefined
            ? workoutCategories.data
                .filter(
                  (category: WorkoutCategory) =>
                    // In edit mode, exclude the current category from parent options
                    !isEdit || category.id !== defaultValues?.id,
                )
                .map((category: WorkoutCategory) => ({
                  value: String(category.id),
                  label: category.name,
                }))
            : []),
        ]}
        value={String(form.data.parent_id ?? "")}
        onChange={(value: string) => form.setData("parent_id", value)}
        error={form.errors.parent_id as string}
        disabled={form.processing}
        allowClear
      />

      {/* Name Field */}
      <InputField
        id="name"
        name="name"
        type="text"
        value={String(form.data.name ?? "")}
        onChange={(event) => form.setData("name", event.target.value)}
        error={form.errors.name as string}
        label="Name"
        placeholder="e.g., Upper Body, Lower Body, etc."
        required
        disabled={form.processing}
      />

      {/* Description Field */}
      <TextareaField
        id="description"
        name="description"
        className="min-h-[96px]"
        placeholder="Describe the workout category's purpose and responsibilities..."
        value={String(form.data.description ?? "")}
        onChange={(event) => form.setData("description", event.target.value)}
        error={form.errors.description as string}
        label="Description"
        disabled={form.processing}
      />
    </FormDialog>
  );
}
