"use client";

import { ClipboardList } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import FileUploadField from "@/components/shared/forms/file-upload-field";
import FormDialog from "@/components/shared/forms/form-dialog";
import InputField from "@/components/shared/forms/input-field";
import SelectField from "@/components/shared/forms/select-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { CreateProgramSchema, EditProgramSchema } from "@/lib/validations/admin/program-schema";
import { Program, ProgramApiResponse, ProgramFormProperties } from "@/types/admin/program";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function ProgramForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
}: ProgramFormProperties) {
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
      title: "",
      description: "",
      thumbnail: undefined as File | string | undefined,
      duration_value: 1,
      duration_unit: "days" as "days" | "weeks" | "months",
      price: 0,
      status: "draft" as "draft" | "published" | "archived",
    },
    {
      validate: isEdit ? EditProgramSchema : CreateProgramSchema,
      tanstack: {
        invalidateQueries: ["admin-programs"],
        mutationOptions: {
          onSuccess: (response) => {
            form.queryCache.setQueryData<ProgramApiResponse>(
              ["admin-programs"],
              (previous) => {
                const base: ProgramApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as Program[],
                        message: previous?.message ?? "",
                      } as ProgramApiResponse);

                const updatedFromServer = (response as ProgramApiResponse)?.data;
                const baseData = (base?.data as Program[]) ?? [];

                if (isEdit && defaultValues) {
                  const existing = baseData.find((r) => r.id === defaultValues.id);
                  const next =
                    updatedFromServer ??
                    (existing
                      ? {
                          ...existing,
                          title: String(form.data.title ?? ""),
                          description: String(form.data.description ?? ""),
                          thumbnail: form.data.thumbnail as File | undefined,
                          duration_value: Number(form.data.duration_value ?? 1),
                          duration_unit: form.data.duration_unit as "days" | "weeks" | "months",
                          price: Number(form.data.price ?? 0),
                          status: form.data.status as "active" | "inactive" | "archived",
                        }
                      : undefined);
                  if (!next) return base;
                  return {
                    ...base,
                    data: baseData.map((r) => (r.id === defaultValues.id ? next : r)),
                  } as ProgramApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return { ...base, data: [updatedFromServer, ...baseData] } as ProgramApiResponse;
                }
                return base as ProgramApiResponse;
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

  useEffect(() => {
    if (isEdit && defaultValues) {
      const newData = {
        title: defaultValues.title ?? "",
        description: defaultValues.description ?? "",
        thumbnail: defaultValues.thumbnail_url || undefined,
        duration_value: Number(defaultValues.duration_value) || 1,
        duration_unit: (defaultValues.duration_unit as "days" | "weeks" | "months") ?? "days",
        price: Number(defaultValues.price) || 0,
        status: (defaultValues.status as "draft" | "published" | "archived") ?? "draft",
      };

      form.setDataAndDefaults(newData);
    } else {
      const newData = {
        title: "",
        description: "",
        thumbnail: undefined as File | string | undefined,
        duration_value: 1,
        duration_unit: "days" as "days" | "weeks" | "months",
        price: 0,
        status: "draft" as "draft" | "published" | "archived",
      };

      form.setDataAndDefaults(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.id, defaultValues?.title, defaultValues?.description, isEdit]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.PROGRAMS.UPDATE(defaultValues.id));
    } else {
      form.post(ENDPOINTS.ADMIN.PROGRAMS.STORE);
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={title ?? (isEdit ? "Edit Program Details" : "Create a New Program")}
      description={
        description ??
        (isEdit
          ? "Edit the program details including title, description, duration, and pricing."
          : "Create a new program with title, description, duration, pricing, and status.")
      }
      icon={<ClipboardList className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Program"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Program..."}
      disabled={isEdit && !form.isDirty}
    >
      {/* Thumbnail Field  */}
      <FileUploadField
        id="program-thumbnail"
        label="Thumbnail"
        value={form.data.thumbnail}
        onChange={(file) => form.setData("thumbnail", file as File | undefined)}
        maxSize={2 * 1024 * 1024}
        accept="image/jpg,image/jpeg,image/png,image/webp"
        required={!isEdit}
        error={form.errors.thumbnail as string}
      />

      {/* Title Field */}
      <InputField
        id="title"
        name="title"
        type="text"
        value={String(form.data.title ?? "")}
        onChange={(event) => form.setData("title", event.target.value)}
        error={form.errors.title as string}
        label="Title"
        placeholder="Program title"
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
        required
      />

      {/* Price Field */}
      <InputField
        id="price"
        name="price"
        type="number"
        inputMode="decimal"
        min={0}
        max={999_999}
        step="0.01"
        value={String(form.data.price ?? 0)}
        onChange={(event) => form.setData("price", Number(event.target.value))}
        error={form.errors.price as string}
        label="Price"
        required
        disabled={form.processing}
      />

      {/* Duration & Price Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          id="duration_value"
          name="duration_value"
          type="number"
          inputMode="numeric"
          min={1}
          max={365}
          step={1}
          value={String(form.data.duration_value ?? 1)}
          onChange={(event) => form.setData("duration_value", Number(event.target.value))}
          error={form.errors.duration_value as string}
          label="Duration"
          required
          disabled={form.processing}
        />

        <SelectField
          id="duration_unit"
          name="duration_unit"
          label="Unit"
          value={String(form.data.duration_unit)}
          onChange={(v) => form.setData("duration_unit", v as "days" | "weeks" | "months")}
          error={form.errors.duration_unit as string}
          options={[
            { value: "days", label: "Days" },
            { value: "weeks", label: "Weeks" },
            { value: "months", label: "Months" },
          ]}
          required
          disabled={form.processing}
        />
      </div>
    </FormDialog>
  );
}
