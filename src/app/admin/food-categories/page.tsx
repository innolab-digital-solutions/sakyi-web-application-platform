import type { Metadata } from "next";

import FoodCategoryForm from "@/components/admin/features/food-categories/food-category-form";
import FoodCategoryTable from "@/components/admin/features/food-categories/food-category-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Food Categories — SaKyi Health & Wellness",
  description:
    "Organize foods into clear, scalable categories so planning and reporting stay simple.",
};

export default function FoodCategoryListPage() {
  return (
    <ResourceListPage
      title="Food Categories"
      description="Organize foods into clear, hierarchical categories to simplify meal planning, nutrition tracking, and food management. Create parent categories and subcategories for better organization."
      createTrigger={
        <FoodCategoryForm mode="create" trigger={<CreateButton label="Add Food Category" />} />
      }
      table={<FoodCategoryTable />}
    />
  );
}
