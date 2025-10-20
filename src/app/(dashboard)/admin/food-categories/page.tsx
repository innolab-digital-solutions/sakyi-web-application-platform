import { FolderKanban } from "lucide-react";
import type { Metadata } from "next";

import FoodCategoryForm from "@/components/admin/features/food-categories/food-category-form";
import FoodCategoryTable from "@/components/admin/features/food-categories/food-category-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Food Categories | SaKyi Health & Wellness",
  description:
    "Manage and structure food categories to organize meals and ingredients efficiently.",
};

export default function FoodCategoryListPage() {
  return (
    <ResourceListPage
      icon={FolderKanban}
      title="Food Categories"
      description="Manage and structure your food categories. Organize parent and child categories to streamline how foods are grouped, making it easier to maintain, update, and navigate your menu."
      createTrigger={
        <FoodCategoryForm mode="create" trigger={<CreateButton label="Add Food Category" />} />
      }
      table={<FoodCategoryTable />}
    />
  );
}
