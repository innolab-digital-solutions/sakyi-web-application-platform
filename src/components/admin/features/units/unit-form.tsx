"use client";

import { ShieldCheck } from "lucide-react";
import React, { useEffect } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { CreateUnitSchema } from "@/lib/validations/admin/unit-schema";
import { UnitFormProperties } from "@/types/admin/unit";

export default function UnitForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  name,
  abbreviation,
}: UnitFormProperties) {
  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const isEdit = mode === "edit";

  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);

    if (!value) form.reset();
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
      form.setData({
        name: defaultValues.name ?? "",
        abbreviation: defaultValues.abbreviation ?? "",
      });
    } else {
      form.setData({
        name: "",
        abbreviation: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.id, defaultValues?.name, defaultValues?.abbreviation, isEdit]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.UNITS.UPDATE(defaultValues.id));
    } else {
      form.post(ENDPOINTS.ADMIN.UNITS.STORE);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : undefined}
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="w-full p-2.5">
          <DialogHeader>
            <DialogTitle className="mb-1 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              {name ?? (isEdit ? "Edit Unit" : "Create Unit")}
            </DialogTitle>

            <DialogDescription className="text-muted-foreground text-sm font-medium">
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
              disabled={form.processing}
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
                  {isEdit ? "Saving Changes..." : "Creating Unit..."}
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  {isEdit ? "Save Changes" : "Create Unit"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
