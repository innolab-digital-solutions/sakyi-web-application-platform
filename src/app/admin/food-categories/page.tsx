import { UtensilsCrossed } from "lucide-react";
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
      icon={UtensilsCrossed}
      title="Food Categories"
      description="Create parent and child categories to keep your food catalog tidy and easy to navigate."
      createTrigger={
        <FoodCategoryForm mode="create" trigger={<CreateButton label="Add Food Category" />} />
      }
      table={<FoodCategoryTable />}
    />
  );
}
