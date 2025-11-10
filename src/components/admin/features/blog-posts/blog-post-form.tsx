"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import FileUploadField from "@/components/shared/forms/file-upload-field";
import InputField from "@/components/shared/forms/input-field";
import SelectField from "@/components/shared/forms/select-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { CreateBlogPostSchema, EditBlogPostSchema } from "@/lib/validations/admin/blog-post-schema";
import { BlogCategory } from "@/types/admin/blog-category";
import { BlogPost } from "@/types/admin/blog-post";

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

export default function BlogPostForm({ blogPost }: { blogPost?: BlogPost }) {
  const router = useRouter();
  const isEdit = Boolean(blogPost?.id);

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
      status: "draft" as "draft" | "published" | "archived",
    },
    {
      validate: isEdit ? EditBlogPostSchema : CreateBlogPostSchema,
      tanstack: {
        invalidateQueries: ["admin-blog-posts"],
        mutationOptions: {
          onSuccess: (response) => {
            toast.success(response.message);
            router.push(PATHS.ADMIN.BLOG_POSTS.LIST);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      },
    },
  );

  // Build FormData payload to support file upload and Laravel method override
  const buildFormData = (payload: typeof form.data) => {
    const fd = new FormData();
    fd.append("blog_category_id", String(payload.blog_category_id ?? 0));
    if (payload.thumbnail instanceof File) {
      fd.append("thumbnail", payload.thumbnail);
    }
    fd.append("title", String(payload.title ?? ""));
    fd.append("description", String(payload.description ?? ""));
    fd.append("content", String(payload.content ?? ""));
    return fd;
  };

  useEffect(() => {
    if (isEdit && blogPost) {
      const newData = {
        blog_category_id: blogPost.category?.id ?? 0,
        thumbnail: blogPost.thumbnail || undefined,
        title: blogPost.title ?? "",
        description: blogPost.description ?? "",
        content: blogPost.content ?? "",
        status: blogPost.status ?? "draft",
      };

      form.setDataAndDefaults(newData);
    } else {
      const newData = {
        blog_category_id: 0,
        thumbnail: undefined as File | string | undefined,
        title: "",
        description: "",
        content: "",
        status: "draft" as const,
      };

      form.setDataAndDefaults(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    blogPost?.id,
    blogPost?.title,
    blogPost?.description,
    blogPost?.content,
    blogPost?.thumbnail,
    blogPost?.category?.id,
    isEdit,
  ]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isEdit && blogPost?.id) {
      form.put(ENDPOINTS.ADMIN.BLOG_POSTS.UPDATE(blogPost.id), { transform: buildFormData });
    } else {
      form.post(ENDPOINTS.ADMIN.BLOG_POSTS.STORE, { transform: buildFormData });
    }
  };

  return (
    <div className="mx-auto w-full">
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="space-y-6 rounded-md border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="space-y-5">
          <div className="space-y-5">
            <FileUploadField
              id="blog-post-thumbnail"
              label="Thumbnail"
              value={form.data.thumbnail}
              onChange={(file) => form.setData("thumbnail", file as File | undefined)}
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
              onChange={(value: string) => {
                const numberValue = value === "" ? 0 : Number(value);
                form.setData("blog_category_id", numberValue);
              }}
              error={form.errors.blog_category_id as string}
              required
              disabled={form.processing}
              allowClear={false}
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
              placeholder="Enter a brief description that will appear in previews and excerpts..."
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
              className="min-h-[300px]"
              placeholder="Write your blog post content here. Use clear paragraphs and formatting to make it easy to read..."
              value={String(form.data.content ?? "")}
              onChange={(event) => form.setData("content", event.target.value)}
              error={form.errors.content as string}
              label="Content"
              disabled={form.processing}
              required
            />
          </div>

          {/* Actions Section */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(PATHS.ADMIN.BLOG_POSTS.LIST)}
              disabled={form.processing}
              className="flex cursor-pointer items-center gap-2 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={form.processing || (isEdit && !form.isDirty)}
              className="flex cursor-pointer items-center gap-2 font-semibold"
            >
              {form.processing
                ? isEdit
                  ? "Saving Changes..."
                  : "Creating Blog Post..."
                : isEdit
                  ? "Save Changes"
                  : "Create Blog Post"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
