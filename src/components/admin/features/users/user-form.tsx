"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import DatepickerField from "@/components/shared/forms/datepicker-field";
import FileUploadField from "@/components/shared/forms/file-upload-field";
import FormDialog from "@/components/shared/forms/form-dialog";
import InputField from "@/components/shared/forms/input-field";
import SelectField from "@/components/shared/forms/select-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { CreateUserSchema, EditUserSchema } from "@/lib/validations/admin/user-schema";
import { Role, RoleApiResponse } from "@/types/admin/role";
import { User, UserApiResponse, UserFormProperties } from "@/types/admin/user";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function UserForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
}: UserFormProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const isEdit = mode === "edit";

  // Fetch roles
  const { data: rolesData } = useRequest<RoleApiResponse>({
    url: ENDPOINTS.LOOKUP.ROLES,
    queryKey: ["lookup-roles"],
  });

  const roleOptions = [
    { value: "", label: "None" },
    ...(rolesData && rolesData.status === "success" && Array.isArray(rolesData.data)
      ? rolesData.data.map((role: Role) => ({
          value: role.name,
          label: role.name,
        }))
      : []),
  ];

  const form = useForm(
    {
      name: "",
      email: "",
      phone: "",
      dob: "",
      gender: "male",
      address: "",
      picture: undefined as File | string | undefined,
      password: "",
      password_confirmation: "",
      role: "",
    },
    {
      validate: isEdit ? EditUserSchema : CreateUserSchema,
      tanstack: {
        invalidateQueries: [
          "admin-users",
          "admin-user",
          "lookup-invoice-users",
          "team-members-lookup",
        ],
        mutationOptions: {
          onSuccess: (response) => {
            form.queryCache.setQueryData<UserApiResponse>(
              ["admin-users"],
              (previous) => {
                const base: UserApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as User[],
                        message: previous?.message ?? "",
                      } as UserApiResponse);

                const updatedFromServer = (response as UserApiResponse)?.data;
                const baseData = (base?.data as User[]) ?? [];

                if (isEdit && defaultValues) {
                  const existing = baseData.find((u) => u.id === defaultValues.id);
                  const next =
                    updatedFromServer ??
                    (existing
                      ? {
                          ...existing,
                          name: String(form.data.name ?? ""),
                          email: String(form.data.email ?? ""),
                          phone: String(form.data.phone ?? ""),
                          dob: String(form.data.dob ?? ""),
                          gender: String(form.data.gender ?? "male"),
                          address: String(form.data.address ?? ""),
                          picture: String(form.data.picture ?? ""),
                          role: String(form.data.role ?? ""),
                        }
                      : undefined);
                  if (!next) return base;
                  return {
                    ...base,
                    data: baseData.map((u) => (u.id === defaultValues.id ? next : u)),
                  } as UserApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return {
                    ...base,
                    data: [updatedFromServer, ...baseData],
                  } as UserApiResponse;
                }

                return base as UserApiResponse;
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
            toast.error(error.message || "Something went wrong");
          },
        },
      },
    },
  );

  // Build FormData
  const buildFormData = (payload: typeof form.data) => {
    const fd = new FormData();
    fd.append("name", String(payload.name ?? ""));
    fd.append("email", String(payload.email ?? ""));
    fd.append("phone", String(payload.phone ?? ""));
    fd.append("dob", String(payload.dob ?? ""));
    fd.append("gender", String(payload.gender ?? "male"));
    fd.append("address", String(payload.address ?? ""));
    if (payload.picture instanceof File) {
      fd.append("picture", payload.picture);
    }
    if (!isEdit && payload.password) {
      fd.append("password", String(payload.password ?? ""));
      fd.append("password_confirmation", String(payload.password_confirmation ?? ""));
    }
    if (payload.role) {
      fd.append("role", payload.role); // singular
    }

    return fd;
  };

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

  // Populate form for editing
  useEffect(() => {
    if (isEdit && defaultValues) {
      const newData = {
        name: defaultValues.profile?.name ?? "",
        picture: defaultValues.profile?.picture || undefined,
        email: defaultValues.profile?.email ?? "",
        phone: defaultValues.profile?.phone ?? "",
        dob: defaultValues.profile?.dob ?? "",
        gender: defaultValues.profile?.gender ?? undefined,
        address: defaultValues.profile?.address ?? "",
        role: defaultValues.profile?.role ?? "",
      };

      form.setDataAndDefaults(newData as Partial<typeof form.data>);
    } else {
      const newData = {
        name: "",
        picture: undefined as File | string | undefined,
        email: "",
        phone: "",
        dob: "",
        gender: undefined,
        password: "",
        password_confirmation: "",
        address: "",
        role: "",
      };

      form.setDataAndDefaults(newData as Partial<typeof form.data>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultValues?.id,
    defaultValues?.profile?.name,
    defaultValues?.profile?.email,
    defaultValues?.profile?.phone,
    defaultValues?.profile?.dob,
    defaultValues?.profile?.gender,
    defaultValues?.profile?.address,
    defaultValues?.profile?.role,
    isEdit,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.USERS.UPDATE(defaultValues.id), { transform: buildFormData });
    } else {
      form.post(ENDPOINTS.ADMIN.USERS.STORE, { transform: buildFormData });
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={title ?? (isEdit ? "Edit User" : "Create User")}
      description={
        description ??
        (isEdit
          ? "Update user information and role with confidence. Ensure each account stays accurate, organized, and aligned with your system's access requirements."
          : "Fill in the user's basic details such as name, email, contact information, profile settings, and assign a role.")
      }
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create User"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating User..."}
      disabled={isEdit && !form.isDirty}
    >
      <FileUploadField
        id="picture"
        label="Avatar"
        value={form.data.picture}
        onChange={(file) => form.setData("picture", file as File | undefined)}
        maxSize={2 * 1024 * 1024}
        accept="image/jpg,image/jpeg,image/png,image/webp"
        error={form.errors.picture as string}
        disabled={form.processing}
      />

      <InputField
        id="name"
        label="Full Name"
        placeholder="eg. John Doe"
        value={form.data.name}
        onChange={(event) => form.setData("name", event.target.value)}
        error={form.errors.name as string}
        required
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          id="email"
          label="Email"
          placeholder="name@example.com"
          type="email"
          value={form.data.email}
          onChange={(event) => form.setData("email", event.target.value)}
          error={form.errors.email as string}
          required
        />

        <InputField
          id="phone"
          label="Phone"
          placeholder="e.g. 09xxxxxxx"
          value={form.data.phone}
          onChange={(event) => form.setData("phone", event.target.value)}
          error={form.errors.phone as string}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DatepickerField
          id="dob"
          label="Date of Birth"
          placeholder="D-M-YYYY"
          value={form.data.dob}
          onChange={(value) => form.setData("dob", value)}
          error={form.errors.dob as string}
          required
        />

        <SelectField
          id="gender"
          label="Gender"
          value={String(form.data.gender ?? "")}
          onChange={(v) => form.setData("gender", v as "male" | "female")}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          disabled={form.processing}
          placeholder="Select gender"
          required
        />
      </div>

      <ComboBoxField
        label="Role"
        id="role"
        placeholder="Choose a role"
        options={roleOptions}
        value={form.data.role ?? ""}
        onChange={(value) => form.setData("role", value ?? "")}
      />

      <InputField
        id="address"
        label="Address"
        placeholder="Street address, city, state"
        value={form.data.address}
        onChange={(event) => form.setData("address", event.target.value)}
        error={form.errors.address as string}
      />

      {!isEdit && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={form.data.password}
            onChange={(event) => form.setData("password", event.target.value)}
            error={form.errors.password as string}
            required
            disabled={form.processing}
          />
          <InputField
            id="password_confirmation"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            value={form.data.password_confirmation}
            onChange={(event) => form.setData("password_confirmation", event.target.value)}
            error={form.errors.password_confirmation as string}
            required
            disabled={form.processing}
          />
        </div>
      )}
    </FormDialog>
  );
}
