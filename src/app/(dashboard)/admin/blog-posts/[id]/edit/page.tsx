"use client";

import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import React from "react";

import BlogPostForm from "@/components/admin/features/blog-posts/blog-post-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useRequest } from "@/hooks/use-request";
import { BlogPost } from "@/types/admin/blog-post";

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const resolvedParameters = React.use(params);

  const { data: blogPost, loading: isLoading } = useRequest({
    url: ENDPOINTS.ADMIN.BLOG_POSTS.SHOW(resolvedParameters.id),
    queryKey: ["admin-blog-post", resolvedParameters.id],
  });

  const loadedPost = blogPost?.data as BlogPost | undefined;

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={FileText}
        title="Edit Blog Post"
        description="Edit the blog post details including title, description, content, and category."
        actions={
          <Button variant="outline" asChild>
            <Link
              href={PATHS.ADMIN.BLOG_POSTS.LIST}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:!bg-gray-100 hover:!text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        }
      />

      {isLoading && (
        <div className="rounded-md border border-gray-200 p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-24 w-full animate-pulse rounded bg-gray-200" />
        </div>
      )}

      {!isLoading && loadedPost && <BlogPostForm blogPost={loadedPost} />}
    </div>
  );
}
