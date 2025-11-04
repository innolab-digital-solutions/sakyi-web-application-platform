"use client";

import { ShieldCheck } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import FormDialog from "@/components/shared/forms/form-dialog";
import InputField from "@/components/shared/forms/input-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { CreateRoleSchema, UpdateRoleSchema } from "@/lib/validations/admin/role-schema";
import { Role, RoleApiResponse, RoleFormProperties } from "@/types/admin/role";
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

  const form = useForm(
    {
      name: "",
      description: "",
    },
    {
      validate: isEdit ? UpdateRoleSchema : CreateRoleSchema,
      tanstack: {
        invalidateQueries: ["admin-roles"],
        mutationOptions: {
          onSuccess: (response) => {
            form.queryCache.setQueryData<RoleApiResponse>(
              ["admin-roles"],
              (previous) => {
                const base: RoleApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as Role[],
                        message: previous?.message ?? "",
                      } as RoleApiResponse);

                const updatedFromServer = (response as RoleApiResponse)?.data;
                const baseData = (base?.data as Role[]) ?? [];

                if (isEdit && defaultValues) {
                  const existing = baseData.find((r) => r.id === defaultValues.id);
                  const next =
                    updatedFromServer ??
                    (existing
                      ? {
                          ...existing,
                          name: String(form.data.name ?? ""),
                          description: String(form.data.description ?? ""),
                        }
                      : undefined);
                  if (!next) return base;
                  return {
                    ...base,
                    data: baseData.map((r) => (r.id === defaultValues.id ? next : r)),
                  } as RoleApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return { ...base, data: [updatedFromServer, ...baseData] } as RoleApiResponse;
                }
                return base as RoleApiResponse;
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

  useEffect(() => {
    if (isEdit && defaultValues) {
      const newData = {
        name: defaultValues.name ?? "",
        description: defaultValues.description ?? "",
      };

      form.setDataAndDefaults(newData);
    } else {
      const newData = {
        name: "",
        description: "",
      };

      form.setDataAndDefaults(newData);
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
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={title ?? (isEdit ? "Edit Role" : "Create Role")}
      description={
        description ??
        (isEdit
          ? "Update the role’s name or description. Changes apply immediately to all members assigned to this role."
          : "Give this role a clear name and a short description. You can assign permissions after creating it to control what admins can view and manage.")
      }
      icon={<ShieldCheck className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Role"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Role..."}
      disabled={isEdit && !form.isDirty}
    >
      {/* Name Field */}
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

      {/* Description Field */}
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
    </FormDialog>
  );
}
