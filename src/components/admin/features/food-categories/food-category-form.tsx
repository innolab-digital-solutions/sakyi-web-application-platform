"use client";

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
  CreateFoodCategorySchema,
  UpdateFoodCategorySchema,
} from "@/lib/validations/admin/food-category-schema";
import {
  FoodCategory,
  FoodCategoryApiResponse,
  FoodCategoryFormProperties,
} from "@/types/admin/food-category";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function FoodCategoryForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
}: FoodCategoryFormProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const isEdit = mode === "edit";

  const { data: foodCategories } = useRequest({
    url: `${ENDPOINTS.LOOKUP.FOOD_CATEGORIES}`,
    queryKey: ["lookup-food-categories"],
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
      validate: isEdit ? UpdateFoodCategorySchema : CreateFoodCategorySchema,
      tanstack: {
        invalidateQueries: ["admin-food-categories", "lookup-food-categories"],
        mutationOptions: {
          onSuccess: (response) => {
            form.queryCache.setQueryData<FoodCategoryApiResponse>(
              ["admin-food-categories"],
              (previous) => {
                const base: FoodCategoryApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as FoodCategory[],
                        message: previous?.message ?? "",
                      } as FoodCategoryApiResponse);

                const updatedFromServer = (response as FoodCategoryApiResponse)?.data;
                const baseData = (base?.data as FoodCategory[]) ?? [];

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
                  } as FoodCategoryApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return {
                    ...base,
                    data: [updatedFromServer, ...baseData],
                  } as FoodCategoryApiResponse;
                }
                return base as FoodCategoryApiResponse;
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

  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);

    if (!value) form.reset();
  };

  useEffect(() => {
    if (isEdit && defaultValues) {
      const newData = {
        parent_id: defaultValues.parent?.id ? String(defaultValues.parent.id) : "",
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
      form.put(ENDPOINTS.ADMIN.FOOD_CATEGORIES.UPDATE(defaultValues.id));
    } else {
      form.post(ENDPOINTS.ADMIN.FOOD_CATEGORIES.STORE);
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={title ?? (isEdit ? "Edit Food Category" : "Create New Food Category")}
      description={
        description ??
        (isEdit
          ? "Update this category's name, description, or parent category to maintain accurate food organization."
          : "Add a new food category with a clear name and optional description. You can set a parent category to create a hierarchical structure.")
      }
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Food Category"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Food Category..."}
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
          ...(Array.isArray(foodCategories?.data) && foodCategories !== undefined
            ? foodCategories.data
                .filter((category: FoodCategory) => !isEdit || category.id !== defaultValues?.id)
                .map((category: FoodCategory) => ({
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
        placeholder="e.g., Appetizers, Desserts, Beverages..."
        required
        disabled={form.processing}
      />

      {/* Description Field */}
      <TextareaField
        id="description"
        name="description"
        className="min-h-[96px]"
        placeholder="Describe the category's purpose..."
        value={String(form.data.description ?? "")}
        onChange={(event) => form.setData("description", event.target.value)}
        error={form.errors.description as string}
        label="Description"
        disabled={form.processing}
      />
    </FormDialog>
  );
}
