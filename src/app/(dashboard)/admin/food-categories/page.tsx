import { FolderTree, Plus } from "lucide-react";
import React from "react";

import FoodCategoryForm from "@/components/admin/features/food-categories/food-category-form";
import FoodCategoryTable from "@/components/admin/features/food-categories/food-category-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function FoodCategoryListPage() {
  return (
    <>
      <PageHeader
        icon={FolderTree}
        title="Food Categories"
        description="Manage and structure your food categories. Organize parent and child categories to streamline how your menu is grouped, making it easier to maintain and update."
        actions={
          <>
            <FoodCategoryForm
              mode="create"
              trigger={
                <Button
                  variant="default"
                  className="flex cursor-pointer items-center font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Food Category</span>
                </Button>
              }
            />
          </>
        }
      />

      <FoodCategoryTable />
    </>
  );
}
