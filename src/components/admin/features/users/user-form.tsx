"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import FileUploadField from "@/components/shared/forms/file-upload-field";
import InputField from "@/components/shared/forms/input-field";
import SelectField from "@/components/shared/forms/select-field";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { CreateUserSchema, EditUserSchema } from "@/lib/validations/admin/user-schema";
import { User, UserApiResponse } from "@/types/admin/user";

const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
  if (event.key === "Enter" && event.target instanceof HTMLElement) {
    const isTextarea = event.target.tagName === "TEXTAREA";
    const targetElement = event.target as HTMLElement;
    const isSubmitButton =
      (targetElement instanceof HTMLButtonElement && targetElement.type === "submit") ||
      targetElement.closest('button[type="submit"]') !== null;

    if (!isTextarea && !isSubmitButton) {
      event.preventDefault();
    }
  }
};

type UserFormPageProperties = {
  user?: User;
};

type RoleInput = { id?: number; name: string };

export default function UserForm({ user }: UserFormPageProperties) {
  const isEdit = Boolean(user);
  const router = useRouter();

  // Fetch roles
  const { data: rolesData } = useRequest<{ data: { id: number; name: string }[] }>({
    url: ENDPOINTS.LOOKUP.ROLES,
    queryKey: ["lookup-roles"],
  });

  const roleOptions =
    rolesData?.data && Array.isArray(rolesData.data)
      ? rolesData.data.map((role) => ({
          value: String(role.id),
          label: role.name,
        }))
      : [];

  const form = useForm(
    {
      name: "",
      username: "",
      email: "",
      phone: "",
      dob: "",
      gender: "male" as "male" | "female" | "other",
      address: "",
      avatar: undefined as File | string | undefined,
      password: "",
      password_confirmation: "",
      status: "active" as "active" | "inactive",
      roles: [{ name: "" }] as RoleInput[],
    },
    {
      validate: isEdit ? EditUserSchema : CreateUserSchema,
      tanstack: {
        invalidateQueries: ["admin-users", "admin-user"],
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
                          username: String(form.data.username ?? ""),
                          email: String(form.data.email ?? ""),
                          phone: String(form.data.phone ?? ""),
                          dob: String(form.data.dob ?? ""),
                          gender: String(form.data.gender ?? "male"),
                          address: String(form.data.address ?? ""),
                          avatar_url: String(form.data.avatar ?? ""),
                          status: String(form.data.status ?? "active"),
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

  // Populate form for editing
  useEffect(() => {
    if (isEdit && user) {
      form.setData({
        name: user.name ?? "",
        username: user.username ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        dob: user.dob ?? "",
        gender: user.gender ?? "male",
        address: user.address ?? "",
        roles: user.roles?.map((role) => ({ id: role.id, name: role.name })) ?? [{ name: "" }],
      });
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Build FormData
  const buildFormData = (payload: typeof form.data) => {
    const fd = new FormData();
    fd.append("name", String(payload.name ?? ""));
    fd.append("username", String(payload.username ?? ""));
    fd.append("email", String(payload.email ?? ""));
    fd.append("phone", String(payload.phone ?? ""));
    fd.append("dob", String(payload.dob ?? ""));
    fd.append("gender", String(payload.gender ?? "male"));
    fd.append("address", String(payload.address ?? ""));
    fd.append("status", String(payload.status ?? "active"));
    if (payload.avatar instanceof File) fd.append("avatar", payload.avatar);
    if (!isEdit) {
      fd.append("password", String(payload.password ?? ""));
      fd.append("password_confirmation", String(payload.password_confirmation ?? ""));
    }
    for (const [index, role] of (payload.roles ?? []).entries()) {
      fd.append(`roles[${index}][id]`, String(role.id ?? ""));
      fd.append(`roles[${index}][name]`, String(role.name ?? ""));
    }
    return fd;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEdit && user?.id) {
      form.put(ENDPOINTS.ADMIN.USERS.UPDATE(user.id), { transform: buildFormData });
    } else {
      form.post(ENDPOINTS.ADMIN.USERS.STORE, { transform: buildFormData });
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* User Info */}
        <div className="space-y-4 rounded-md border border-gray-200 p-6">
          <FileUploadField
            id="avatar"
            label="Avatar"
            value={form.data.avatar}
            onChange={(file) => form.setData("avatar", file as File | undefined)}
            maxSize={2 * 1024 * 1024}
            accept="image/jpg,image/jpeg,image/png,image/webp"
            error={form.errors.avatar as string}
          />

          <InputField
            id="name"
            label="Full Name"
            placeholder="Enter full name"
            value={form.data.name}
            onChange={(e) => form.setData("name", e.target.value)}
            error={form.errors.name as string}
            required
          />

          <InputField
            id="email"
            label="Email"
            placeholder="Enter email"
            type="email"
            value={form.data.email}
            onChange={(e) => form.setData("email", e.target.value)}
            error={form.errors.email as string}
            required
          />

          <InputField
            id="phone"
            label="Phone"
            placeholder="Enter phone number"
            value={form.data.phone}
            onChange={(e) => form.setData("phone", e.target.value)}
            error={form.errors.phone as string}
          />

          <InputField
            id="dob"
            label="Date of Birth"
            placeholder="YYYY-MM-DD"
            type="date"
            value={form.data.dob}
            onChange={(e) => form.setData("dob", e.target.value)}
            error={form.errors.dob as string}
          />
        </div>

        {/* Roles */}
        <div className="space-y-4 rounded-md border border-gray-200 p-6">
          <SelectField
            id="gender"
            label="Gender"
            value={form.data.gender}
            onChange={(v) => form.setData("gender", v as "male" | "female" | "other")}
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
            required
          />

          <InputField
            id="address"
            label="Address"
            placeholder="Enter address"
            value={form.data.address}
            onChange={(e) => form.setData("address", e.target.value)}
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
                onChange={(e) => form.setData("password", e.target.value)}
                error={form.errors.password as string}
                required
              />
              <InputField
                id="password_confirmation"
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
                value={form.data.password_confirmation}
                onChange={(e) => form.setData("password_confirmation", e.target.value)}
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
            value={form.data.roles?.[0]?.id ? String(form.data.roles[0].id) : ""}
            onChange={(value) => {
              const selected = rolesData?.data?.find((r) => String(r.id) === value);
              form.setData("roles", [
                {
                  id: selected?.id ?? null,
                  name: selected?.name ?? "",
                },
              ]);
            }}
            required
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
