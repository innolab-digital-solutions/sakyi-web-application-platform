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
import { BlogPost, BlogPostApiResponse } from "@/types/admin/blog-post";

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
        invalidateQueries: ["admin-blog-posts", "admin-blog-post"],
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
                        message: (previous as { message?: string } | undefined)?.message ?? "",
                      } as BlogPostApiResponse);

                const updatedFromServer = (response as unknown as { data?: BlogPost | BlogPost[] })
                  .data as BlogPost | BlogPost[] | undefined;
                const baseData = ((base?.data as BlogPost[]) ?? []) as BlogPost[];

                // If editing
                if (isEdit && blogPost?.id) {
                  const nextBlogPost = Array.isArray(updatedFromServer)
                    ? updatedFromServer[0]
                    : (updatedFromServer as BlogPost | undefined);
                  const existing = baseData.find((p) => p.id === blogPost.id);
                  const merged =
                    nextBlogPost ??
                    (existing
                      ? {
                          ...existing,
                          title: String(form.data.title ?? ""),
                          description: String(form.data.description ?? ""),
                          content: String(form.data.content ?? ""),
                          blog_category_id: Number(form.data.blog_category_id ?? 0),
                          status: String(form.data.status ?? "draft") as
                            | "draft"
                            | "published"
                            | "archived",
                          thumbnail_url:
                            typeof form.data.thumbnail === "string"
                              ? form.data.thumbnail
                              : existing.thumbnail,
                        }
                      : undefined);

                  if (!merged) return base;
                  return {
                    ...base,
                    data: baseData.map((r) => (r.id === blogPost.id ? merged : r)),
                  } as BlogPostApiResponse;
                }

                // If creating new
                if (!isEdit && updatedFromServer) {
                  const created = Array.isArray(updatedFromServer)
                    ? updatedFromServer[0]
                    : (updatedFromServer as BlogPost);
                  return { ...base, data: [created, ...baseData] } as BlogPostApiResponse;
                }

                return base as BlogPostApiResponse;
              },
              { all: true },
            );

            // Update specific cache if editing
            if (isEdit && blogPost?.id) {
              form.queryCache.setQueryData(["admin-blog-post", String(blogPost.id)], (previous) => {
                const nextBlogPost = (response as unknown as { data?: BlogPost | BlogPost[] })
                  ?.data;
                if (!nextBlogPost) return previous;
                return {
                  status: "success",
                  message: (previous as { message?: string } | undefined)?.message ?? "",
                  data: Array.isArray(nextBlogPost) ? nextBlogPost[0] : nextBlogPost,
                } as unknown;
              });
            }

            router.push(PATHS.ADMIN.BLOG_POSTS.LIST);
            toast.success(response.message);
          },
          onError: (error) => toast.error(error.message),
        },
      },
    },
  );

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
      form.put(ENDPOINTS.ADMIN.BLOG_POSTS.UPDATE(blogPost.id), {
        onSuccess: (response) => {
          toast.success(response.message);
          router.push(PATHS.ADMIN.BLOG_POSTS.LIST);
        },
      });
    } else {
      form.post(ENDPOINTS.ADMIN.BLOG_POSTS.STORE, {
        onSuccess: (response) => {
          toast.success(response.message);
          router.push(PATHS.ADMIN.BLOG_POSTS.LIST);
        },
      });
    }
  };

  return (
    <div className="mx-auto w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid auto-rows-min gap-6 lg:grid-cols-3">
          {/* Left Card - Media */}
          <div className="h-fit rounded-md border border-gray-200 bg-white p-5 shadow-sm lg:col-span-1">
            <div className="space-y-4">
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">
                  Thumbnail
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload a thumbnail image for your blog post. This will be displayed in previews
                  and listings
                </p>
              </div>

              <FileUploadField
                id="blog-post-thumbnail"
                value={form.data.thumbnail as File | string | null | undefined}
                onChange={(file) => {
                  // Explicitly set to undefined when null to clear the preview
                  form.setData("thumbnail", file === null ? undefined : (file as File | string));
                }}
                maxSize={2 * 1024 * 1024}
                accept="image/jpg,image/jpeg,image/png,image/webp"
                required={!isEdit}
                error={form.errors.thumbnail as string}
                disabled={form.processing}
              />
            </div>
          </div>

          {/* Right Card - Content Fields */}
          <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="space-y-5">
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-gray-900">Content</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add the essentials—category, title, short summary, and the main content. Keep it
                  clear and well‑structured to help readers and search discover your post.
                </p>
              </div>

              <div className="space-y-5">
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
                  className="min-h-24"
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

                {/* Status Select */}
                <SelectField
                  id="status"
                  name="status"
                  label="Status"
                  value={String(form.data.status ?? "draft")}
                  onChange={(value) =>
                    form.setData("status", value as "draft" | "published" | "archived")
                  }
                  error={form.errors.status as string}
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Published", value: "published" },
                    { label: "Archived", value: "archived" },
                  ]}
                  disabled={form.processing}
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
                      ? "Saving..."
                      : "Creating..."
                    : isEdit
                      ? "Save Changes"
                      : "Create Blog Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
