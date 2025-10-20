"use client";

import { ClipboardList } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import FileUploadField from "@/components/shared/forms/file-upload-field";
import FormDialog from "@/components/shared/forms/form-dialog";
import InputField from "@/components/shared/forms/input-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { ProgramSchema } from "@/lib/validations/admin/program-schema";
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

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

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
      thumbnail: undefined as unknown as File | null,
      duration_value: 1,
      duration_unit: "days" as "days" | "weeks" | "months",
      price: 0,
      status: "active" as "active" | "inactive" | "archived",
    },
    {
      validate: ProgramSchema,
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
      form.setData({
        title: defaultValues.title ?? "",
        description: defaultValues.description ?? "",
      });
    } else {
      form.setData({
        title: "",
        description: "",
      });
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
          ? "Edit the name or description of this role. Changes will update user access and permissions."
          : "Create a role with a name and description to manage user access and permissions.")
      }
      icon={<ClipboardList className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Program"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Program..."}
    >
      <FileUploadField
        id="program-thumbnail"
        label="Thumbnail"
        value={form.data.thumbnail}
        onChange={(v) => form.setData("thumbnail", v as File | null)}
        maxFiles={1}
        maxSize={2 * 1024 * 1024}
        onFileReject={onFileReject}
        required
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
      />
    </FormDialog>
  );
}
