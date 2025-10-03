"use client";

import { ClipboardCheck } from "lucide-react";
import React from "react";
import { toast } from "sonner";

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
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { CreateFoodCategorySchema } from "@/lib/validations/admin/food-category-schema";
import { FoodCategoryFormProperties } from "@/types/admin/food-category";

export default function CategoryForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
  categories = [],
}: FoodCategoryFormProperties) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";

  const dialogOpen = isControlled ? open : internalOpen;

  const setDialogOpen = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setInternalOpen(value);
  };

  const categoriesForSelect = categories.filter((cat) => cat.id !== defaultValues?.id);

  const form = useForm(
    {
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      parent_id: defaultValues?.parent_id ?? undefined,
    },
    {
      validate: CreateFoodCategorySchema,
      requireAuth: true,
      tanstack: {
        invalidateQueries: ["admin-food-categories"],
        mutationOptions: {
          onSuccess: (response) => {
            toast.success(response.message);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      },
    },
  );

  React.useEffect(() => {
    if (dialogOpen) {
      form.setData("name", defaultValues?.name ?? "");
      form.setData("description", defaultValues?.description ?? "");
      form.setData("parent_id", defaultValues?.parent_id ?? undefined);
      form.clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen, defaultValues?.name, defaultValues?.description, defaultValues?.parent_id]);

  const isEdit = mode === "edit";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.submit("put", ENDPOINTS.ADMIN.FOOD_CATEGORIES.UPDATE(defaultValues.id), {
        onSuccess: () => setDialogOpen(false),
      });
    } else {
      form.submit("post", ENDPOINTS.ADMIN.FOOD_CATEGORIES.STORE, {
        onSuccess: () => {
          setDialogOpen(false);
          form.reset();
        },
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <form onSubmit={handleSubmit} className="w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              {title ?? (isEdit ? "Edit Category" : "Create Category")}
            </DialogTitle>
            <DialogDescription>
              {description ??
                (isEdit
                  ? "Update the category details and save your changes."
                  : "Provide a name, description, and optional parent category.")}
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
              label="Category Name"
              placeholder="e.g., Appetizers, Desserts, Beverages..."
              required
            />

            <TextareaField
              id="description"
              name="description"
              className="min-h-[96px]"
              placeholder="Describe the category..."
              value={String(form.data.description ?? "")}
              onChange={(event) => form.setData("description", event.target.value)}
              error={form.errors.description as string}
              label="Description"
            />

            {/* Parent Category select */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Parent Category
              </label>
              <select
                value={form.data.parent_id ?? ""}
                onChange={(event) =>
                  form.setData(
                    "parent_id",
                    event.target.value ? Number(event.target.value) : undefined,
                  )
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring focus:ring-indigo-200 focus:outline-none"
              >
                <option value="">None</option>
                {categoriesForSelect.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="flex items-center space-x-3">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={form.processing}>
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit" disabled={form.processing}>
              {form.processing
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                  ? "Save changes"
                  : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
