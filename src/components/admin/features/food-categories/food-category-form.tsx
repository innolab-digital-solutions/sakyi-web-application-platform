"use client";

import { ShieldCheck } from "lucide-react";
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
import { CreateFoodCategorySchema } from "@/lib/validations/admin/food-category-schema";
import { FoodCategory, FoodCategoryFormProperties } from "@/types/admin/food-category";

export default function FoodCategoryForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
}: FoodCategoryFormProperties) {
  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const isEdit = mode === "edit";

  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);

    if (!value) form.reset();
  };

  const { data: foodCategories } = useRequest({
    url: `${ENDPOINTS.META.FOOD_CATEGORIES}`,
    queryKey: ["food-categories"],
    data: { only: "parent" },
    requireAuth: true,
    staleTime: 1000 * 60 * 5,
  });

  const form = useForm(
    {
      parent_id: "",
      name: "",
      description: "",
    },
    {
      validate: CreateFoodCategorySchema,
      requireAuth: true,
      tanstack: {
        invalidateQueries: ["admin-food-categories"],
        mutationOptions: {
          onSuccess: (response) => {
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
        parent_id: defaultValues.parent?.id ?? "",
        name: defaultValues.name ?? "",
        description: defaultValues.description ?? "",
      });
    } else {
      form.setData({
        parent_id: "",
        name: "",
        description: "",
      });
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
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="w-full p-2.5">
          <DialogHeader>
            <DialogTitle className="mb-1 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              {title ?? (isEdit ? "Edit Food Category Details" : "Create a New Food Category")}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm font-medium">
              {description ??
                (isEdit
                  ? "Modify the food category’s name and description. Changes will update items assigned to this category."
                  : "Enter a clear name and description to define this food category.")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-5">
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
                      .filter(
                        (category: FoodCategory) => !isEdit || category.id !== defaultValues?.id,
                      )
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
                  {isEdit ? "Saving Changes..." : "Creating Workout Category..."}
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  {isEdit ? "Save Changes" : "Create Workout Category"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
