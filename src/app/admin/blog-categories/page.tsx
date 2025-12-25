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
      title="Blog Categories"
      description="Organize your blog content into clear categories so readers can find what they need and your content stays easy to manage and discover."
      createTrigger={
        <BlogCategoryForm mode="create" trigger={<CreateButton label="Add Blog Category" />} />
      }
      table={<BlogCategoryTable />}
    />
  );
}
