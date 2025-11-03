import { ArrowLeft, FileText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import BlogPostForm from "@/components/admin/features/blog-posts/blog-post-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Create Blog Post",
};

export default function CreateBlogPostPage() {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={FileText}
        title="Create Blog Post"
        description="Create a new blog post with thumbnail, title, description, content, and category."
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

      <BlogPostForm />
    </div>
  );
}
