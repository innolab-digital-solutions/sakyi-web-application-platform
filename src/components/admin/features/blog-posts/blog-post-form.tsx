"use client";

import { FileText } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import FileUploadField from "@/components/shared/forms/file-upload-field";
import FormDialog from "@/components/shared/forms/form-dialog";
import InputField from "@/components/shared/forms/input-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { CreateBlogPostSchema, EditBlogPostSchema } from "@/lib/validations/admin/blog-post-schema";
import { BlogCategory } from "@/types/admin/blog-category";
import { BlogPost, BlogPostApiResponse, BlogPostFormProperties } from "@/types/admin/blog-post";
import { buildDefaultListUrl } from "@/utils/shared/parameters";

export default function BlogPostForm({
  mode,
  trigger,
  defaultValues,
  open,
  onOpenChange,
  title,
  description,
}: BlogPostFormProperties) {
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

  // Fetch blog categories for the dropdown
  const { data: blogCategories } = useRequest({
    url: ENDPOINTS.LOOKUP.BLOG_CATEGORIES,
    queryKey: ["lookup-blog-categories"],
    staleTime: 1000 * 60 * 5,
  });

  const form = useForm(
    {
      blog_category_id: 0,
      thumbnail: undefined as unknown as File | string,
      title: "",
      description: "",
      content: "",
    },
    {
      validate: isEdit ? EditBlogPostSchema : CreateBlogPostSchema,
      tanstack: {
        invalidateQueries: ["admin-blog-posts"],
        mutationOptions: {
          onSuccess: (response) => {
            form.queryCache.setQueryData<BlogPostApiResponse>(
              ["admin-blog-posts"],
              (previous) => {
                const base: BlogPostApiResponse =
                  previous && previous.status === "success" && Array.isArray(previous.data)
                    ? previous
                    : ({
                        status: "success",
                        data: [] as BlogPost[],
                        message: previous?.message ?? "",
                      } as BlogPostApiResponse);

                const updatedFromServer = (response as BlogPostApiResponse)?.data;
                const baseData = (base?.data as BlogPost[]) ?? [];

                if (isEdit && defaultValues) {
                  const existing = baseData.find((r) => r.id === defaultValues.id);
                  const next =
                    updatedFromServer ??
                    (existing
                      ? {
                          ...existing,
                          title: String(form.data.title ?? ""),
                          description: String(form.data.description ?? ""),
                          content: String(form.data.content ?? ""),
                          thumbnail:
                            form.data.thumbnail && typeof form.data.thumbnail === "string"
                              ? form.data.thumbnail
                              : existing.thumbnail,
                          category: defaultValues.category,
                        }
                      : undefined);
                  if (!next) return base;
                  return {
                    ...base,
                    data: baseData.map((r) => (r.id === defaultValues.id ? next : r)),
                  } as BlogPostApiResponse;
                }

                if (!isEdit && updatedFromServer) {
                  return {
                    ...base,
                    data: [updatedFromServer, ...baseData],
                  } as BlogPostApiResponse;
                }
                return base as BlogPostApiResponse;
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
        blog_category_id: defaultValues.category?.id ?? 0,
        thumbnail: defaultValues.thumbnail || undefined,
        title: defaultValues.title ?? "",
        description: defaultValues.description ?? "",
        content: defaultValues.content ?? "",
      };

      form.setDataAndDefaults(newData);
    } else {
      const newData = {
        blog_category_id: 0,
        thumbnail: undefined as File | string | undefined,
        title: "",
        description: "",
        content: "",
      };

      form.setDataAndDefaults(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    defaultValues?.id,
    defaultValues?.title,
    defaultValues?.description,
    defaultValues?.content,
    defaultValues?.thumbnail,
    defaultValues?.category?.id,
    isEdit,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && defaultValues?.id) {
      form.put(ENDPOINTS.ADMIN.BLOG_POSTS.UPDATE(defaultValues.id));
    } else {
      form.post(ENDPOINTS.ADMIN.BLOG_POSTS.STORE);
    }
  };

  return (
    <FormDialog
      trigger={trigger}
      open={dialogOpen}
      onOpenChange={handleDialogOpenChange}
      onClose={() => form.reset()}
      title={title ?? (isEdit ? "Edit Blog Post" : "Create a New Blog Post")}
      description={
        description ??
        (isEdit
          ? "Edit the blog post details including title, description, content, and category."
          : "Create a new blog post with thumbnail, title, description, content, and category.")
      }
      icon={<FileText className="h-5 w-5" />}
      onSubmit={handleSubmit}
      processing={form.processing}
      isEdit={isEdit}
      submitLabel={isEdit ? "Save Changes" : "Create Blog Post"}
      submittingLabel={isEdit ? "Saving Changes..." : "Creating Blog Post..."}
      disabled={isEdit && !form.isDirty}
    >
      {/* Thumbnail Field */}
      <FileUploadField
        id="blog-post-thumbnail"
        label="Thumbnail"
        description="Upload a thumbnail image for the blog post (JPG, PNG, JPEG, or WEBP, max 2MB)"
        value={form.data.thumbnail as File | string | null | undefined}
        onChange={(file) =>
          form.setData("thumbnail", (file ?? undefined) as File | string | undefined)
        }
        maxSize={2 * 1024 * 1024}
        accept="image/jpg,image/jpeg,image/png,image/webp"
        required={!isEdit}
        error={form.errors.thumbnail as string}
        disabled={form.processing}
      />

      {/* Category Field */}
      <ComboBoxField
        id="blog_category_id"
        name="blog_category_id"
        label="Category"
        description="Select a category for this blog post"
        placeholder="Select a category..."
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found."
        options={
          Array.isArray(blogCategories?.data) && blogCategories !== undefined
            ? blogCategories.data.map((category: BlogCategory) => ({
                value: String(category.id),
                label: category.name,
              }))
            : []
        }
        value={String(form.data.blog_category_id ?? "")}
        onChange={(value: string) => form.setData("blog_category_id", Number(value))}
        error={form.errors.blog_category_id as string}
        required
        disabled={form.processing}
        allowClear
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
        placeholder="Enter blog post title"
        required
        disabled={form.processing}
      />

      {/* Description Field */}
      <TextareaField
        id="description"
        name="description"
        className="min-h-[96px]"
        placeholder="Enter a brief description of the blog post..."
        value={String(form.data.description ?? "")}
        onChange={(event) => form.setData("description", event.target.value)}
        error={form.errors.description as string}
        label="Description"
        disabled={form.processing}
        required
      />

      {/* Content Field */}
      <TextareaField
        id="content"
        name="content"
        className="min-h-[200px]"
        placeholder="Enter the blog post content..."
        value={String(form.data.content ?? "")}
        onChange={(event) => form.setData("content", event.target.value)}
        error={form.errors.content as string}
        label="Content"
        disabled={form.processing}
        required
      />
    </FormDialog>
  );
}
