import { FileText } from "lucide-react";
import type { Metadata } from "next";

import BlogCategoryForm from "@/components/admin/features/blog-categories/blog-category-form";
import BlogCategoryTable from "@/components/admin/features/blog-categories/blog-category-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Blog Categories — SaKyi Health & Wellness",
  description: "Organize content into clear categories so readers—and search—can find it fast.",
};

export default function FoodCategoryListPage() {
  return (
    <ResourceListPage
      icon={FileText}
      title="Blog Categories"
      description="Create and maintain categories to structure your content and improve discoverability."
      createTrigger={
        <BlogCategoryForm mode="create" trigger={<CreateButton label="Add Blog Category" />} />
      }
      table={<BlogCategoryTable />}
    />
  );
}
