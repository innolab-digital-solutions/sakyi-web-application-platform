import type { Metadata } from "next";

import FoodItemForm from "@/components/admin/features/food-items/food-item-form";
import FoodItemTable from "@/components/admin/features/food-items/food-item-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Food Items — SaKyi Health & Wellness",
  description:
    "Maintain a clean, accurate catalog of foods to power meal planning and nutrition tracking.",
};

export default function FoodItemListPage() {
  return (
    <ResourceListPage
      title="Food Items"
      description="Manage your food catalog with detailed nutritional information. Add, edit, and organize food items with calories, categories, and units to support accurate meal planning and nutrition tracking."
      createTrigger={
        <FoodItemForm mode="create" trigger={<CreateButton label="Add Food Item" />} />
      }
      table={<FoodItemTable />}
    />
  );
}
