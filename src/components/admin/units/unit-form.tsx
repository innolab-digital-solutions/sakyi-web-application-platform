"use client";

import { Ruler } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { InputField } from "@/components/shared/forms/input-field";
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
import { CreateUnitSchema } from "@/lib/validations/admin/unit-schema";
import { UnitFormProperties } from "@/types/admin/unit"; // custom type

export default function UnitForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  name,
  abbreviation,
}: UnitFormProperties) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";

  const dialogOpen = isControlled ? open : internalOpen;

  const setDialogOpen = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setInternalOpen(value);
  };

  const form = useForm(
    {
      name: defaultValues?.name ?? "",
      abbreviation: defaultValues?.abbreviation ?? "",
    },
    {
      validate: CreateUnitSchema,
      requireAuth: true,
      tanstack: {
        invalidateQueries: ["admin-units"],
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
      if (defaultValues?.name !== undefined) {
        form.setData("name", defaultValues?.name ?? "");
      }
      if (defaultValues?.abbreviation !== undefined) {
        form.setData("abbreviation", defaultValues?.abbreviation ?? "");
      }
      form.clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen, defaultValues?.name, defaultValues?.abbreviation]);

  const isEdit = mode === "edit";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.submit("put", ENDPOINTS.ADMIN.UNITS.UPDATE(defaultValues.id), {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    } else {
      form.submit("post", ENDPOINTS.ADMIN.UNITS.STORE, {
        onSuccess: () => {
          setDialogOpen(false);
          form.reset();
        },
      });
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : undefined}
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <form onSubmit={handleSubmit} className="w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ruler className="h-5 w-5" />
              {name ?? (isEdit ? "Edit Unit" : "Create Unit")}
            </DialogTitle>
            <DialogDescription>
              {abbreviation ??
                (isEdit
                  ? "Update the unit details and save your changes."
                  : "Provide a name and abbreviation for the new unit.")}
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
              placeholder="e.g., Kilogram, Gram, Liter"
              required
            />

            <InputField
              id="abbreviation"
              name="abbreviation"
              type="text"
              value={String(form.data.abbreviation ?? "")}
              onChange={(event) => form.setData("abbreviation", event.target.value)}
              error={form.errors.abbreviation as string}
              label="Abbreviation"
              placeholder="e.g., kg, g, L"
              required
            />
          </div>

          <DialogFooter className="flex items-center space-x-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={form.processing}
                className="flex items-center gap-2 bg-gray-100 text-sm font-semibold text-gray-800 hover:bg-gray-200 hover:text-black"
              >
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
                  : "Create unit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
