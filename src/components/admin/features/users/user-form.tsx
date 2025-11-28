"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import DatepickerField from "@/components/shared/forms/datepicker-field";
import FileUploadField from "@/components/shared/forms/file-upload-field";
import InputField from "@/components/shared/forms/input-field";
import SelectField from "@/components/shared/forms/select-field";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { CreateUserSchema, EditUserSchema } from "@/lib/validations/admin/user-schema";
import { Role, User, UserApiResponse } from "@/types/admin/user";

type UserFormPageProperties = {
  user?: User;
};

export default function UserForm({ user }: UserFormPageProperties) {
  const isEdit = Boolean(user);
  const router = useRouter();

  // Fetch roles
  const { data: rolesData } = useRequest<Role[]>({
    url: ENDPOINTS.LOOKUP.ROLES,
    queryKey: ["lookup-roles"],
  });

  const roleOptions =
    rolesData?.data?.map((role: Role) => ({
      value: role.name,
      label: role.name,
    })) ?? [];

  const form = useForm(
    isEdit && user
      ? {
          name: user.name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
          dob: user.dob ?? "",
          gender: user.gender ?? undefined,
          address: user.address ?? "",
          picture: user.picture || undefined,
          role: user.role ?? "",
        }
      : {
          name: "",
          email: "",
          phone: "",
          dob: "",
          gender: undefined,
          address: "",
          picture: undefined as File | string | undefined,
          password: "",
          password_confirmation: "",
          role: "",
        },
    {
      validate: isEdit ? EditUserSchema : CreateUserSchema,
      tanstack: {
        invalidateQueries: ["admin-users", "admin-user", "lookup-invoice-users"],
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

                if (isEdit && user) {
                  const existing = baseData.find((u) => u.id === user.id);
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
                          picture_url: String(form.data.picture ?? ""),
                          roles: form.data.roles ?? [],
                        }
                      : existing);

                  return {
                    ...base,
                    data: baseData.map((u) => (u.id === user.id ? next : u)),
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

            toast.success(response.message);
            router.push(PATHS.ADMIN.USERS.LIST);
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

  // Populate form for editing
  useEffect(() => {
    if (isEdit && user) {
      const newData = {
        name: user.name ?? "",
        picture: user.picture || undefined,
        email: user.email ?? "",
        phone: user.phone ?? "",
        dob: user.dob ?? "",
        gender: user.gender ?? undefined,
        address: user.address ?? "",
        role: user.role ?? "",
      };

      form.setDataAndDefaults(newData);
    } else {
      const newData = {
        name: "",
        picture: undefined as File | string | undefined,
        username: "",
        email: "",
        phone: "",
        dob: "",
        gender: undefined,
        password: "",
        password_confirmation: "",
        address: "",
        role: "",
      };

      form.setDataAndDefaults(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    user?.id,
    user?.name,
    user?.email,
    user?.phone,
    user?.dob,
    user?.picture,
    user?.gender,
    user?.address,
    user?.role,
    isEdit,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && user?.id) {
      form.put(ENDPOINTS.ADMIN.USERS.UPDATE(user.id), { transform: buildFormData });
    } else {
      form.post(ENDPOINTS.ADMIN.USERS.STORE, { transform: buildFormData });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* User Info */}
        <div className="space-y-4 rounded-md border border-gray-200 p-6">
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
            placeholder="Enter full name"
            value={form.data.name}
            onChange={(event) => form.setData("name", event.target.value)}
            error={form.errors.name as string}
            required
          />

          <InputField
            id="email"
            label="Email"
            placeholder="Enter email"
            type="email"
            value={form.data.email}
            onChange={(event) => form.setData("email", event.target.value)}
            error={form.errors.email as string}
            required
          />

          <InputField
            id="phone"
            label="Phone"
            placeholder="Enter phone number"
            value={form.data.phone}
            onChange={(event) => form.setData("phone", event.target.value)}
            error={form.errors.phone as string}
          />

          <DatepickerField
            id="dob"
            label="Date of Birth"
            placeholder="Select date"
            value={form.data.dob}
            onChange={(value) => form.setData("dob", value)}
            error={form.errors.dob as string}
            required
          />
        </div>

        {/* Roles */}
        <div className="space-y-4 rounded-md border border-gray-200 p-6">
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
            required
          />

          <InputField
            id="address"
            label="Address"
            placeholder="Enter address"
            value={form.data.address}
            onChange={(event) => form.setData("address", event.target.value)}
            error={form.errors.address as string}
          />

          {!isEdit && (
            <>
              <InputField
                id="password"
                label="Password"
                type="password"
                placeholder="Enter password"
                value={form.data.password}
                onChange={(event) => form.setData("password", event.target.value)}
                error={form.errors.password as string}
                required
              />
              <InputField
                id="password_confirmation"
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
                value={form.data.password_confirmation}
                onChange={(event) => form.setData("password_confirmation", event.target.value)}
                error={form.errors.password_confirmation as string}
                required
              />
            </>
          )}

          <label className="text-sm font-semibold text-gray-700">Roles</label>

          <ComboBoxField
            id="role"
            placeholder="Select role"
            options={roleOptions}
            value={form.data.role ?? ""}
            onChange={(value) => form.setData("role", value ?? "")}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.processing || (isEdit && !form.isDirty)}>
          {form.processing
            ? isEdit
              ? "Saving Changes..."
              : "Creating User..."
            : isEdit
              ? "Save Changes"
              : "Create User"}
        </Button>
      </div>
    </form>
  );
}
