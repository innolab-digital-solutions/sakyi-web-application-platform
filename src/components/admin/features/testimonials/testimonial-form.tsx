"use client";

import { User2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import FormDialog from "@/components/shared/forms/form-dialog";
import SelectField from "@/components/shared/forms/select-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import {
  CreateTestimonialSchema,
  UpdateTestimonialSchema,
} from "@/lib/validations/admin/testimonial-schema";
import {
  Enrollment,
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

  // Lookup enrollments
  const { data: enrollments } = useRequest<Enrollment[]>({
    url: ENDPOINTS.LOOKUP.ENROLLMENTS,
    queryKey: ["lookup-enrollments"],
    staleTime: 1000 * 60 * 5,
  });

  // Form setup
  const form = useForm(
    {
      enrollment_id: "",
      rating: 5,
      comment: "",
    },
    {
      validate: isEdit ? UpdateTestimonialSchema : CreateTestimonialSchema,
      tanstack: {
        invalidateQueries: ["admin-testimonials", "lookup-enrollments"],
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
                          enrollment_id: Number(form.data.enrollment_id),
                          rating: Number(form.data.rating),
                          comment: form.data.comment,
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
    },
  );

  // Handle dialog open/close
  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);

    if (!value) form.reset();
  };

  // Handle form submit
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.TESTIMONIALS.UPDATE(defaultValues.id));
    } else {
      form.post(ENDPOINTS.ADMIN.TESTIMONIALS.STORE);
    }
  };

  // Set default form data when enrollments or defaultValues change
  useEffect(() => {
    if (isEdit && defaultValues && enrollments?.data) {
      const newData = {
        enrollment_id: String(defaultValues.enrollment?.id ?? ""),
        rating: defaultValues.rating ?? 5,
        comment: defaultValues.comment ?? "",
      };
      form.setDataAndDefaults(newData);
    } else {
      const newData = {
        enrollment_id: "",
        rating: 5,
        comment: "",
      };
      form.setDataAndDefaults(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isEdit,
    defaultValues?.id,
    defaultValues?.enrollment,
    defaultValues?.rating,
    defaultValues?.comment,
  ]);

  // ComboBox options with loading state
  const enrollmentOptions = [
    ...(defaultValues?.enrollment
      ? [
          {
            value: String(defaultValues.enrollment.id),
            label: `${defaultValues.enrollment.user.name} — ${defaultValues.enrollment.program.title}`,
          },
        ]
      : []),
    ...(enrollments?.data ?? []).map((enrollment) => ({
      value: String(enrollment.id),
      label: `${enrollment.user?.name ?? "Unknown"} — ${enrollment.program?.title ?? "Unknown"}`,
    })),
  ];

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={isEdit ? "Edit Testimonial" : "Create Testimonial"}
      description={
        isEdit ? "Update testimonial details." : "Add a new testimonial linked to an enrollment."
      }
      icon={<User2 className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Testimonial"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Testimonial..."}
    >
      {/* Enrollment */}
      <ComboBoxField
        id="enrollment_id"
        name="enrollment_id"
        label="Enrollment"
        placeholder="Select enrollment..."
        options={enrollmentOptions}
        value={form.data.enrollment_id}
        onChange={(value: string) => form.setData("enrollment_id", value)}
        error={form.errors.enrollment_id as string}
        required
        disabled={form.processing || !enrollments}
        allowClear
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
