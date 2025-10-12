"use client";

import { ShieldCheck } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { RoleSchema } from "@/lib/validations/admin/role-schema";
import { RoleFormProperties } from "@/types/admin/role";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function RoleForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
}: RoleFormProperties) {
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

  const form = useForm(
    {
      name: "",
      description: "",
    },
    {
      validate: RoleSchema,
      tanstack: {
        invalidateQueries: ["admin-roles"],
        mutationOptions: {
          onSuccess: (response) => {
            handleDialogOpenChange(false);

            if (!isEdit) {
              const url = buildDefaultListUrl(pathname, searchParameters);
              router.replace(url, { scroll: false });
            }

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
        description: defaultValues.description ?? "",
      });
    } else {
      form.setData({
        name: "",
        description: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.id, defaultValues?.name, defaultValues?.description, isEdit]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.ROLES.UPDATE(defaultValues.id));
    } else {
      form.post(ENDPOINTS.ADMIN.ROLES.STORE);
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
            <DialogTitle className="text-md mb-1 flex items-center gap-2 font-bold">
              <ShieldCheck className="h-5 w-5" />
              {title ?? (isEdit ? "Edit Role Details" : "Create a New Role")}
            </DialogTitle>

            <DialogDescription className="text-muted-foreground text-sm font-medium">
              {description ??
                (isEdit
                  ? "Edit the name or description of this role. Changes will update user access and permissions."
                  : "Create a role with a name and description to manage user access and permissions.")}
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
              placeholder="e.g., Administrator, Moderator, etc."
              required
              disabled={form.processing}
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
                  {isEdit ? "Saving Changes..." : "Creating Role..."}
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  {isEdit ? "Save Changes" : "Create Role"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
