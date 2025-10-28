"use client";

import { FolderKanban } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import FormDialog from "@/components/shared/forms/form-dialog";
import { InputField } from "@/components/shared/forms/input-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { CreateBlogCategorySchema } from "@/lib/validations/admin/blog-category-schema";
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
  name,
}: BlogCategoryFormProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const dialogOpen = isControlled ? open : uncontrolledOpen;
  const isEdit = mode === "edit";

  const handleDialogOpenChange = (value: boolean) => {
    if (isControlled) onOpenChange?.(value);
    else setUncontrolledOpen(value);

    if (!value) form.reset();
  };

  const form = useForm(
    {
      name: "",
      slug: "",
      description: "",
    },
    {
      validate: CreateBlogCategorySchema,
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
                          slug: String(form.data.slug ?? ""),
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
          onError: (error) => toast.error(error.message),
        },
      },
    },
  );

  useEffect(() => {
    if (isEdit && defaultValues) {
      form.setData({
        name: defaultValues.name ?? "",
        slug: defaultValues.slug ?? "",
      });
    } else {
      form.setData({
        name: "",
        slug: "",
        description: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.id, defaultValues?.name, defaultValues?.slug, isEdit]);

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
      title={name ?? (isEdit ? "Edit Blog Category" : "Create a New Blog Category")}
      icon={<FolderKanban className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Blog Category"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Blog Category..."}
    >
      {/* name Field */}
      <InputField
        id="name"
        name="name"
        type="text"
        value={String(form.data.name ?? "")}
        onChange={(event) => form.setData("name", event.target.value)}
        error={form.errors.name as string}
        label="Name"
        placeholder="e.g., Technology, Health, Food..."
        required
        disabled={form.processing}
      />

      {/* Slug Field */}
      <InputField
        id="slug"
        name="slug"
        type="text"
        value={String(form.data.slug ?? "")}
        onChange={(event) => form.setData("slug", event.target.value)}
        error={form.errors.slug as string}
        label="Slug"
        placeholder="e.g., technology, health, food"
        required
        disabled={form.processing}
      />
    </FormDialog>
  );
}
