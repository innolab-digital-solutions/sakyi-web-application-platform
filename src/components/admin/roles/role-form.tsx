"use client";

import { ShieldCheck } from "lucide-react";
import React from "react";

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
import { CreateRoleSchema } from "@/lib/validations/admin/role-schema";

type Role = {
  id?: string | number;
  name: string;
  description?: string | null;
};

type RoleFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<Role>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (response: unknown) => void;
  title?: string;
  description?: string;
};

export default function RoleForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  onSuccess,
  title,
  description,
}: RoleFormProperties) {
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
      description: defaultValues?.description ?? "",
    },
    {
      validate: CreateRoleSchema,
      requireAuth: true,
    },
  );

  React.useEffect(() => {
    if (dialogOpen) {
      if (defaultValues?.name !== undefined) {
        form.setData("name", defaultValues?.name ?? "");
      }
      if (defaultValues?.description !== undefined) {
        form.setData("description", defaultValues?.description ?? "");
      }
      form.clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen, defaultValues?.name, defaultValues?.description]);

  const isEdit = mode === "edit";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.ROLES.UPDATE(defaultValues.id), {
        onSuccess: (response) => {
          onSuccess?.(response);
          setDialogOpen(false);
        },
        onError: (error) => {
          console.error("Error updating role:", error);
        },
      });
    } else {
      form.post(ENDPOINTS.ADMIN.ROLES.STORE, {
        onSuccess: (response) => {
          onSuccess?.(response);
          setDialogOpen(false);
          // Reset form after successful create
          form.setData("name", "");
          form.setData("description", "");
        },
        onError: (error) => {
          console.error("Error creating role:", error);
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
              <ShieldCheck className="h-5 w-5" />
              {title ?? (isEdit ? "Edit Role" : "Create Role")}
            </DialogTitle>
            <DialogDescription>
              {description ??
                (isEdit
                  ? "Update the role details and save your changes."
                  : "Provide a name and description for the new role.")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-5">
            <InputField
              id="name"
              name="name"
              type="text"
              value={String(form.data.name ?? "")}
              onChange={(event) => form.setData("name", event.target.value)}
              error={form.errors.name as string}
              label="Name"
              placeholder="e.g., Administrator, Moderator, etc."
              required
            />

            <TextareaField
              id="description"
              name="description"
              className="min-h-[96px]"
              placeholder="Describe the role's purpose and responsibilities..."
              value={String(form.data.description ?? "")}
              onChange={(event) => form.setData("description", event.target.value)}
              error={form.errors.description as string}
              label="Description"
            />
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
                  : "Create role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
