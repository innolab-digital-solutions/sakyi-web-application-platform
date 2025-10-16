import { FolderKanban, Plus } from "lucide-react";
import type { Metadata } from "next";

import FoodCategoryForm from "@/components/admin/features/food-categories/food-category-form";
import FoodCategoryTable from "@/components/admin/features/food-categories/food-category-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Food Categories | SaKyi Health & Wellness",
  description:
    "Manage and structure food categories to organize meals and ingredients efficiently.",
};

export default function FoodCategoryListPage() {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={FolderKanban}
        title="Food Categories"
        description="Manage and structure your food categories. Organize parent and child categories to streamline how foods are grouped, making it easier to maintain, update, and navigate your menu."
        actions={
          <FoodCategoryForm
            mode="create"
            trigger={
              <Button variant="default" className="flex cursor-pointer items-center font-semibold">
                <Plus className="h-4 w-4" />
                <span>Add Food Category</span>
              </Button>
            }
          />
        }
      />

      <FoodCategoryTable />
    </div>
  );
}
