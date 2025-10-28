import { Salad } from "lucide-react";
import type { Metadata } from "next";

import FoodItemForm from "@/components/admin/features/food-items/food-item-form";
import FoodItemTable from "@/components/admin/features/food-items/food-item-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Food Items | SaKyi Health & Wellness",
  description: "Manage and standardize food items for nutrition tracking and meal planning.",
};

export default function FoodItemListPage() {
  return (
    <ResourceListPage
      icon={Salad}
      title="Food Items"
      description="Manage and standardize food items for consistent meal planning and nutrition tracking. Add, edit, or organize items to build a reliable food database."
      createTrigger={
        <FoodItemForm mode="create" trigger={<CreateButton label="Add Food Item" />} />
      }
      table={<FoodItemTable />}
    />
  );
}
