import { Plus, Salad } from "lucide-react";
import React from "react";

import FoodItemForm from "@/components/admin/features/food-items/food-item-form";
import FoodItemTable from "@/components/admin/features/food-items/food-item-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function FoodItemListPage() {
  return (
    <>
      <PageHeader
        icon={Salad}
        title="Food Items"
        description="Manage and standardize measurement units such as grams, kilograms, and liters. Units are used throughout the dashboard to ensure consistency in meals, nutrition tracking, and workout planning."
        actions={
          <>
            <FoodItemForm
              mode="create"
              trigger={
                <Button
                  variant="default"
                  className="flex cursor-pointer items-center font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Food Item</span>
                </Button>
              }
            />
          </>
        }
      />

      <FoodItemTable />
    </>
  );
}
