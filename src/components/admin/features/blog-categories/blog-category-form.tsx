"use client";

import { FileText } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import FormDialog from "@/components/shared/forms/form-dialog";
import InputField from "@/components/shared/forms/input-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import {
  CreateBlogCategorySchema,
  UpdateBlogCategorySchema,
} from "@/lib/validations/admin/blog-category-schema";
import {
  BlogCategory,
  BlogCategoryApiResponse,
  BlogCategoryFormProperties,
} from "@/types/admin/blog-category";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function BlogCategoryForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
}: BlogCategoryFormProperties) {
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
      validate: isEdit ? UpdateBlogCategorySchema : CreateBlogCategorySchema,
      tanstack: {
        invalidateQueries: ["admin-blog-categories"],
        mutationOptions: {
          onSuccess: (response) => {
            form.queryCache.setQueryData<BlogCategoryApiResponse>(
              ["admin-blog-categories"],
              (previous) => {
                const base: BlogCategoryApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as BlogCategory[],
                        message: previous?.message ?? "",
                      } as BlogCategoryApiResponse);

                const updatedFromServer = (response as BlogCategoryApiResponse)?.data;
                const baseData = (base?.data as BlogCategory[]) ?? [];

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
                  } as BlogCategoryApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return {
                    ...base,
                    data: [updatedFromServer, ...baseData],
                  } as BlogCategoryApiResponse;
                }
                return base as BlogCategoryApiResponse;
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
      form.put(ENDPOINTS.ADMIN.BLOG_CATEGORIES.UPDATE(defaultValues.id));
    } else {
      form.post(ENDPOINTS.ADMIN.BLOG_CATEGORIES.STORE);
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={title ?? (isEdit ? "Edit Blog Category" : "Create Blog Category")}
      description={
        description ??
        (isEdit
          ? "Update the category’s name or description. Changes apply to all posts filed under this category."
          : "Add a category with a clear name and short description to keep your content structured and discoverable.")
      }
      icon={<FileText className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Blog Category"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Blog Category..."}
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
        placeholder="e.g., Technology, Health, etc."
        required
        disabled={form.processing}
      />

      {/* Description Field */}
      <TextareaField
        id="description"
        name="description"
        className="min-h-[96px]"
        placeholder="Describe the blog category's purpose and content..."
        value={String(form.data.description ?? "")}
        onChange={(event) => form.setData("description", event.target.value)}
        error={form.errors.description as string}
        label="Description"
        disabled={form.processing}
      />
    </FormDialog>
  );
}
