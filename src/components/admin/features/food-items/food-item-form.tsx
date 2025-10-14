"use client";

import { Salad } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import { ComboBoxField } from "@/components/shared/forms/combo-box-field";
import { InputField } from "@/components/shared/forms/input-field";
import { TextareaField } from "@/components/shared/forms/textarea-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { CreateFoodItemSchema } from "@/lib/validations/admin/food-item-schema";
import { FoodCategory } from "@/types/admin/food-category";
import { FoodItemFormProperties } from "@/types/admin/food-item";
import { Unit } from "@/types/admin/unit";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function FoodItemForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
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

  // Fetch categories and units for combobox
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

  const form = useForm(
    {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      calories_per_unit: defaultValues?.calories_per_unit ?? 0,
      food_category_id: defaultValues?.category?.id ?? 0,
      unit_id: defaultValues?.unit?.id ?? 0,
    },
    {
      validate: CreateFoodItemSchema,
      tanstack: {
        invalidateQueries: ["admin-food-items"],
        mutationOptions: {
          onSuccess: (response) => {
            handleDialogOpenChange(false);
            if (!isEdit) {
              const url = buildDefaultListUrl(pathname, searchParameters);
              router.replace(url, { scroll: false });
            }
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
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="w-full p-2.5">
          <DialogHeader>
            <DialogTitle className="text-md mb-1 flex items-center gap-2 font-bold">
              <Salad className="h-5 w-5" />
              {isEdit ? "Edit Food Item" : "Create a New Food Item"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm font-medium">
              {isEdit
                ? "Edit the food item's details. Changes will update menus and nutritional info."
                : "Create a food item with category, unit, calories, and description."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-5">
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
            />

            <ComboBoxField
              id="unit_id"
              name="unit_id"
              label="Unit"
              placeholder="Select a unit..."
              searchPlaceholder="Search units..."
              emptyMessage="No units found."
              options={
                Array.isArray(units?.data)
                  ? units.data.map((unit: Unit) => ({ value: String(unit.id), label: unit.name }))
                  : []
              }
              value={String(form.data.unit_id ?? "")}
              onChange={(value: string) => form.setData("unit_id", Number(value))}
              error={form.errors.unit_id as string}
              required
              disabled={form.processing}
            />
          </div>

          <DialogFooter className="flex items-center space-x-1">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={form.processing}
                className="cursor-pointer hover:bg-gray-100 hover:text-gray-800"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              variant="default"
              disabled={form.processing}
              className="flex cursor-pointer items-center gap-2 font-semibold"
            >
              {form.processing ? (
                <>
                  <Spinner />
                  {isEdit ? "Saving Changes..." : "Creating Food Item..."}
                </>
              ) : (
                <>
                  <Salad className="h-4 w-4" />
                  {isEdit ? "Save Changes" : "Create Food Item"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
