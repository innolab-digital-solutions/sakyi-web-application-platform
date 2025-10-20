"use client";

import { Salad } from "lucide-react";
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
import { CreateFoodItemSchema } from "@/lib/validations/admin/food-item-schema";
import { FoodCategory } from "@/types/admin/food-category";
import { FoodItem, FoodItemApiResponse, FoodItemFormProperties } from "@/types/admin/food-item";
import { Unit } from "@/types/admin/unit";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function FoodItemForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
}: FoodItemFormProperties) {
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

  // Fetch metadata (categories and units)
  const { data: categories } = useRequest({
    url: ENDPOINTS.META.FOOD_CATEGORIES,
    queryKey: ["meta-food-categories"],
    staleTime: 1000 * 60 * 5,
  });

  const { data: units } = useRequest({
    url: ENDPOINTS.META.UNITS,
    queryKey: ["meta-units"],
    staleTime: 1000 * 60 * 5,
  });

  // --- Form setup
  const form = useForm(
    {
      name: "",
      description: "",
      calories_per_unit: 0,
      food_category_id: 0,
      unit_id: 0,
    },
    {
      validate: CreateFoodItemSchema,
      tanstack: {
        invalidateQueries: ["admin-food-items", "meta-food-categories"],
        mutationOptions: {
          onSuccess: (response) => {
            form.queryCache.setQueryData<FoodItemApiResponse>(
              ["admin-food-items"],
              (previous) => {
                const base: FoodItemApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as FoodItem[],
                        message: previous?.message ?? "",
                      } as FoodItemApiResponse);

                const updatedFromServer = (response as FoodItemApiResponse)?.data;
                const baseData = (base?.data as FoodItem[]) ?? [];

                if (isEdit && defaultValues) {
                  const existing = baseData.find((r) => r.id === defaultValues.id);
                  const next =
                    updatedFromServer ??
                    (existing
                      ? {
                          ...existing,
                          name: form.data.name,
                          description: form.data.description,
                          calories_per_unit: Number(form.data.calories_per_unit),
                          category: defaultValues.category,
                          unit: defaultValues.unit,
                        }
                      : undefined);
                  if (!next) return base;
                  return {
                    ...base,
                    data: baseData.map((r) => (r.id === defaultValues.id ? next : r)),
                  } as FoodItemApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return {
                    ...base,
                    data: [updatedFromServer, ...baseData],
                  } as FoodItemApiResponse;
                }

                return base as FoodItemApiResponse;
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
    if (isEdit && defaultValues) {
      form.setData({
        name: defaultValues.name ?? "",
        description: defaultValues.description ?? "",
        calories_per_unit: defaultValues.calories_per_unit ?? 0,
        food_category_id: defaultValues.category?.id ?? 0,
        unit_id: defaultValues.unit?.id ?? 0,
      });
    } else {
      form.setData({
        name: "",
        description: "",
        calories_per_unit: 0,
        food_category_id: 0,
        unit_id: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultValues?.id,
    defaultValues?.name,
    defaultValues?.description,
    defaultValues?.calories_per_unit,
    defaultValues?.category?.id,
    defaultValues?.unit?.id,
    isEdit,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.FOOD_ITEMS.UPDATE(defaultValues.id));
    } else {
      form.post(ENDPOINTS.ADMIN.FOOD_ITEMS.STORE);
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={title ?? (isEdit ? "Edit Food Item" : "Create a New Food Item")}
      description={
        description ??
        (isEdit
          ? "Edit the food item's details. Changes will update menus and nutritional information."
          : "Create a food item with category, unit, calories, and description.")
      }
      icon={<Salad className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Food Item"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Food Item..."}
    >
      {/* Name */}
      <InputField
        id="name"
        name="name"
        type="text"
        value={String(form.data.name ?? "")}
        onChange={(event) => form.setData("name", event.target.value)}
        error={form.errors.name as string}
        label="Name"
        placeholder="e.g., Fried Rice"
        required
        disabled={form.processing}
      />

      {/* Description */}
      <TextareaField
        id="description"
        name="description"
        className="min-h-[96px]"
        value={String(form.data.description ?? "")}
        onChange={(event) => form.setData("description", event.target.value)}
        error={form.errors.description as string}
        label="Description"
        placeholder="Short description of the food item"
        disabled={form.processing}
      />

      {/* Calories */}
      <InputField
        id="calories_per_unit"
        name="calories_per_unit"
        type="number"
        min={0}
        value={String(form.data.calories_per_unit ?? "")}
        onChange={(event) => form.setData("calories_per_unit", Number(event.target.value))}
        error={form.errors.calories_per_unit as string}
        label="Calories per Unit"
        placeholder="e.g., 250"
        required
        disabled={form.processing}
      />

      {/* Category */}
      <ComboBoxField
        id="food_category_id"
        name="food_category_id"
        label="Food Category"
        placeholder="Select a category..."
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found."
        options={
          Array.isArray(categories?.data)
            ? categories.data.map((category: FoodCategory) => ({
                value: String(category.id),
                label: category.name,
              }))
            : []
        }
        value={String(form.data.food_category_id ?? "")}
        onChange={(value: string) => form.setData("food_category_id", Number(value))}
        error={form.errors.food_category_id as string}
        required
        disabled={form.processing}
        allowClear
      />

      {/* Unit */}
      <ComboBoxField
        id="unit_id"
        name="unit_id"
        label="Unit"
        placeholder="Select a unit..."
        searchPlaceholder="Search units..."
        emptyMessage="No units found."
        options={
          Array.isArray(units?.data)
            ? units.data.map((unit: Unit) => ({
                value: String(unit.id),
                label: unit.name,
              }))
            : []
        }
        value={String(form.data.unit_id ?? 0)}
        onChange={(value: string) => form.setData("unit_id", Number(value))}
        error={form.errors.unit_id as string}
        required
        disabled={form.processing}
        allowClear
      />
    </FormDialog>
  );
}
