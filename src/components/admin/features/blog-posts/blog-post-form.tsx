"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import EditorField from "@/components/shared/forms/editor-field";
import FileUploadField from "@/components/shared/forms/file-upload-field";
import InputField from "@/components/shared/forms/input-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
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
      status: blogPost?.status ?? "draft",
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
    fd.append("status", String(payload.status ?? "draft"));
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
        status: (blogPost.status ?? "draft").toLowerCase() as "draft" | "published",
      };

      form.setDataAndDefaults(newData);
    } else {
      const newData = {
        blog_category_id: 0,
        thumbnail: undefined as File | string | undefined,
        title: "",
        description: "",
        content: "",
        status: "draft" as "draft" | "published",
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
    blogPost?.status,
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
      <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          {/* Left Column: Thumbnail and Status */}
          <div className="space-y-6 rounded-md border border-gray-200 bg-white p-5 shadow-sm lg:col-span-1 lg:self-start">
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

            {/* Status Field */}
            <div className="space-y-3">
              <Label htmlFor="status" className="text-sm font-semibold text-gray-700">
                Publication Status
              </Label>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        form.data.status === "published" ? "text-primary" : "text-gray-600"
                      }`}
                    >
                      {form.data.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {form.data.status === "published"
                      ? "This post is live and visible to readers"
                      : "This post is saved as a draft and not yet published"}
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Switch
                        id="status"
                        checked={form.data.status === "published"}
                        onCheckedChange={(checked) => {
                          form.setData("status", checked ? "published" : "draft");
                        }}
                        disabled={form.processing || (isEdit && blogPost?.status === "published")}
                        aria-label="Toggle publication status"
                        className="disabled:cursor-not-allowed"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-popover text-popover-foreground border-border max-w-xs rounded-md border px-3 py-2 shadow-lg">
                    <p className="text-sm">
                      {isEdit && blogPost?.status === "published"
                        ? "Published posts cannot be reverted to draft. Once published, the post remains live. If you no longer want this post visible, you can move it to archive from the blog posts list."
                        : form.data.status === "published"
                          ? "Toggle to save as draft"
                          : "Toggle to publish this post"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              {form.errors.status && (
                <p className="text-sm text-red-600">{form.errors.status as string}</p>
              )}
            </div>
          </div>

          {/* Right Column: Category, Title, Description, Content */}
          <div className="space-y-6 rounded-md border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            <ComboBoxField
              id="blog_category_id"
              name="blog_category_id"
              label="Category"
              placeholder="Select a blog category..."
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

            <InputField
              id="title"
              name="title"
              type="text"
              value={String(form.data.title ?? "")}
              onChange={(event) => form.setData("title", event.target.value)}
              error={form.errors.title as string}
              label="Title"
              placeholder="e.g., 10 Tips for Healthy Living, The Benefits of Regular Exercise"
              required
              disabled={form.processing}
            />

            <TextareaField
              id="description"
              name="description"
              className="min-h-24"
              placeholder="Enter a brief description that will appear in previews, excerpts, and search results..."
              value={String(form.data.description ?? "")}
              onChange={(event) => form.setData("description", event.target.value)}
              error={form.errors.description as string}
              label="Description"
              disabled={form.processing}
              required
            />

            <EditorField
              id="content"
              label="Content"
              value={String(form.data.content ?? "")}
              onChange={(nextValue) => form.setData("content", nextValue)}
              error={form.errors.content as string}
              required
              disabled={form.processing}
            />

            {/* Actions Section */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(PATHS.ADMIN.BLOG_POSTS.LIST)}
                disabled={form.processing}
                className="cursor-pointer bg-gray-100 hover:bg-gray-50 hover:text-gray-800"
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
        </div>
      </form>
    </div>
  );
}
