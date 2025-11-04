import { NotebookText, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import BlogPostTable from "@/components/admin/features/blog-posts/blog-post-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Blog Posts — SaKyi Health & Wellness",
  description: "Create, edit, and publish articles that educate and inspire your audience.",
};

export default function BlogPostListPage() {
  return (
    <ResourceListPage
      icon={NotebookText}
      title="Blog Posts"
      description="Draft, review, and publish posts with the right metadata and categories for a great reading experience."
      createTrigger={
        <Button
          asChild
          variant="default"
          className="flex cursor-pointer items-center gap-2 font-semibold"
        >
          <Link href={PATHS.ADMIN.BLOG_POSTS.CREATE}>
            <Plus className="h-4 w-4" />
            Create Blog Post
          </Link>
        </Button>
      }
      table={<BlogPostTable />}
    />
  );
}
