"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "sonner";

import ComboBoxField from "@/components/shared/forms/combo-box-field";
import FileUploadField from "@/components/shared/forms/file-upload-field";
import InputField from "@/components/shared/forms/input-field";
import TextareaField from "@/components/shared/forms/textarea-field";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { CreateBlogPostSchema, EditBlogPostSchema } from "@/lib/validations/admin/blog-post-schema";
import { BlogCategory } from "@/types/admin/blog-category";
import { BlogPost } from "@/types/admin/blog-post";

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
    },
    {
      validate: isEdit ? EditBlogPostSchema : CreateBlogPostSchema,
      tanstack: {
        invalidateQueries: ["admin-blog-posts"],
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
                  Provide the essential information for your blog post, including the category,
                  title, description, and main content. Well-organized and detailed content helps
                  engage your audience and enhances the visibility of your post.
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
