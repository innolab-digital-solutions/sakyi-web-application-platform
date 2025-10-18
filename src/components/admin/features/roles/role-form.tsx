"use client";

import { ShieldCheck } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import { FormDialog } from "@/components/shared/forms/form-dialog";
import { InputField } from "@/components/shared/forms/input-field";
import { TextareaField } from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { RoleSchema } from "@/lib/validations/admin/role-schema";
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
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={title ?? (isEdit ? "Edit Role Details" : "Create a New Role")}
      description={
        description ??
        (isEdit
          ? "Edit the name or description of this role. Changes will update user access and permissions."
          : "Create a role with a name and description to manage user access and permissions.")
      }
      icon={<ShieldCheck className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Role"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Role..."}
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
