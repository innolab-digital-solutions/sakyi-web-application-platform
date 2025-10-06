"use client";

import { ClipboardCheck, Plus } from "lucide-react";

import CategoryForm from "@/components/admin/foodcategories/food-category-form";
import CategoryTable from "@/components/admin/foodcategories/food-category-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useTable } from "@/hooks/use-table";
import { FoodCategory } from "@/types/admin/food-category";

export default function FoodCategoryListPage() {
  const { data: categoriesData } = useTable<FoodCategory>({
    endpoint: ENDPOINTS.ADMIN.FOOD_CATEGORIES.INDEX,
    queryKey: ["admin-food-categories-dropdown"],
    defaultSort: { field: "id", direction: "desc" },
  });

  const mainCategories = (categoriesData ?? []).filter((cat) => !cat.parent);
  return (
    <>
      <PageHeader
        icon={ClipboardCheck}
        title="Food Categories"
        description="Manage food categories to structure your menu efficiently and keep your offerings organized."
        actions={
          <>
            <CategoryForm
              mode="create"
              categories={(mainCategories ?? []).map((cat) => ({
                id: cat.id,
                name: cat.name,
                parent_id: cat.parent_id ?? undefined,
              }))}
              trigger={
                <Button
                  variant="default"
                  className="flex h-10 w-full cursor-pointer items-center gap-2 text-sm font-medium sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Category</span>
                </Button>
              }
            />
          </>
        }
      />

      <CategoryTable />
    </>
  );
}
