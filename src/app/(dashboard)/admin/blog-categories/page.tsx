import { FileText } from "lucide-react";
import type { Metadata } from "next";

import BlogCategoryForm from "@/components/admin/features/blog-categories/blog-category-form";
import BlogCategoryTable from "@/components/admin/features/blog-categories/blog-category-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Blog Categories | SaKyi Health & Wellness",
  description:
    "Manage and organize blog categories to structure your content, making it easier for readers to find articles by topic or interest.",
};

export default function FoodCategoryListPage() {
  return (
    <ResourceListPage
      icon={FileText}
      title="Blog Categories"
      description="Manage and organize blog categories to structure your content. Easily create, edit, and maintain categories for a better reading experience."
      createTrigger={
        <BlogCategoryForm mode="create" trigger={<CreateButton label="Add Blog Category" />} />
      }
      table={<BlogCategoryTable />}
    />
  );
}
