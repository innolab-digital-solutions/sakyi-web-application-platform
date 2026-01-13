"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

import FileUploadField from "@/components/shared/forms/file-upload-field";
import FormDialog from "@/components/shared/forms/form-dialog";
import InputField from "@/components/shared/forms/input-field";
import SelectField from "@/components/shared/forms/select-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import {
  CreateTestimonialSchema,
  UpdateTestimonialSchema,
} from "@/lib/validations/admin/testimonial-schema";
import {
  Testimonial,
  TestimonialApiResponse,
  TestimonialFormProperties,
} from "@/types/admin/testimonial";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function TestimonialForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
}: TestimonialFormProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const isEdit = mode === "edit";

  const initialValues: z.infer<typeof CreateTestimonialSchema> = {
    name: "",
    picture: undefined,
    rating: 5,
    comment: "",
  } as unknown as z.infer<typeof CreateTestimonialSchema>;

  const form = useForm<typeof CreateTestimonialSchema>(initialValues, {
    validate: isEdit ? UpdateTestimonialSchema : CreateTestimonialSchema,
    tanstack: {
      invalidateQueries: ["admin-testimonials"],
      mutationOptions: {
        onSuccess: (response) => {
          // Update cache optimistically
          form.queryCache.setQueryData<TestimonialApiResponse>(
            ["admin-testimonials"],
            (previous) => {
              const base: TestimonialApiResponse =
                previous && previous.status === "success" && Array.isArray(previous.data)
                  ? previous
                  : ({
                      status: "success",
                      data: [] as Testimonial[],
                      message: previous?.message ?? "",
                    } as TestimonialApiResponse);

              const updatedFromServer = (response as TestimonialApiResponse)?.data;
              const baseData = (base?.data as Testimonial[]) ?? [];

              if (isEdit && defaultValues?.id) {
                const existing = baseData.find((r) => r.id === defaultValues.id);
                const next =
                  updatedFromServer ??
                  (existing
                    ? {
                        ...existing,
                        rating: Number(form.data.rating),
                        comment: form.data.comment,
                        reviewer: {
                          ...existing.reviewer,
                          name: form.data.name,
                          picture:
                            typeof form.data.picture === "string"
                              ? existing.reviewer.picture
                              : existing.reviewer.picture,
                        },
                      }
                    : undefined);
                if (!next) return base;
                return {
                  ...base,
                  data: baseData.map((r) => (r.id === defaultValues.id ? next : r)),
                } as TestimonialApiResponse;
              }

              if (!isEdit && updatedFromServer) {
                return {
                  ...base,
                  data: [updatedFromServer, ...baseData],
                } as TestimonialApiResponse;
              }

              return base as TestimonialApiResponse;
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
        onError: (error) => toast.error(error.message),
      },
    },
  });

  // Handle dialog open/close
  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);

    if (!value) form.reset();
  };

  const buildFormData = (payload: typeof form.data) => {
    const fd = new FormData();
    fd.append("name", String(payload.name ?? ""));
    fd.append("rating", String(payload.rating ?? ""));
    fd.append("comment", String(payload.comment ?? ""));

    if (payload.picture instanceof File) {
      fd.append("picture", payload.picture);
    }

    return fd;
  };

  // Handle form submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.TESTIMONIALS.UPDATE(defaultValues.id), {
        transform: buildFormData,
      });
    } else {
      form.post(ENDPOINTS.ADMIN.TESTIMONIALS.STORE, {
        transform: buildFormData,
      });
    }
  };

  // Set default form data when defaultValues change
  useEffect(() => {
    if (isEdit && defaultValues) {
      const newData = {
        name: defaultValues.reviewer?.name ?? "",
        picture: defaultValues.reviewer?.picture ?? undefined,
        rating: defaultValues.rating ?? 5,
        comment: defaultValues.comment ?? "",
      };
      form.setDataAndDefaults(newData);
    } else {
      const newData = {
        name: "",
        picture: undefined,
        rating: 5,
        comment: "",
      };
      form.setDataAndDefaults(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isEdit,
    defaultValues?.id,
    defaultValues?.reviewer?.name,
    defaultValues?.reviewer?.picture,
    defaultValues?.rating,
    defaultValues?.comment,
  ]);

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={isEdit ? "Edit Testimonial" : "Create New Testimonial"}
      description={
        isEdit
          ? "Update this testimonial's reviewer information, rating, or comment to keep client feedback accurate and up-to-date."
          : "Add a new testimonial by entering reviewer details, rating, and comment to showcase authentic client experiences."
      }
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Testimonial"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Testimonial..."}
    >
      {/* Reviewer Picture */}
      <FileUploadField
        id="picture"
        label="Reviewer Picture"
        value={form.data.picture as File | string | null | undefined}
        onChange={(file) => form.setData("picture", file as File | undefined)}
        maxSize={2 * 1024 * 1024}
        accept="image/jpg,image/jpeg,image/png,image/webp"
        error={form.errors.picture as string}
      />

      {/* Reviewer Name */}
      <InputField
        id="name"
        name="name"
        type="text"
        label="Reviewer Name"
        placeholder="Enter the reviewer's name"
        value={String(form.data.name ?? "")}
        onChange={(event) => form.setData("name", event.target.value)}
        error={form.errors.name as string}
        required
        disabled={form.processing}
      />

      {/* Rating */}
      <SelectField
        id="rating"
        name="rating"
        label="Rating"
        value={String(form.data.rating)}
        onChange={(value) => form.setData("rating", Number(value))}
        error={form.errors.rating as string}
        options={[
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
          { label: "5", value: "5" },
        ]}
        required
        disabled={form.processing}
      />

      {/* Comment */}
      <TextareaField
        id="comment"
        name="comment"
        label="Comment"
        placeholder="Enter testimonial comment"
        value={form.data.comment}
        onChange={(event) => form.setData("comment", event.target.value)}
        error={form.errors.comment as string}
        required
        disabled={form.processing}
      />
    </FormDialog>
  );
}
