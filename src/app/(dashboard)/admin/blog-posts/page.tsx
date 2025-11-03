import { NotebookText } from "lucide-react";
import type { Metadata } from "next";

import BlogPostForm from "@/components/admin/features/blog-posts/blog-post-form";
import BlogPostTable from "@/components/admin/features/blog-posts/blog-post-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Blog Posts | SaKyi Health & Wellness",
  description:
    "Manage and organize blog posts to structure your content. Easily create, edit, and maintain posts for a better reading experience.",
};

export default function BlogPostListPage() {
  return (
    <ResourceListPage
      icon={NotebookText}
      title="Blog Posts"
      description="Manage and organize blog posts to structure your content. Easily create, edit, and maintain posts for a better reading experience."
      createTrigger={
        <BlogPostForm mode="create" trigger={<CreateButton label="Add Blog Post" />} />
      }
      table={<BlogPostTable />}
    />
  );
}
