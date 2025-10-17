import React from "react";

import FoodCategoryFiltersDropdown from "@/components/admin/features/food-categories/food-category-filters-dropdown";
import { foodCategoriesTableColumns } from "@/components/admin/features/food-categories/food-category-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { FoodCategory } from "@/types/admin/food-category";

export default function FoodCategoryTable() {
  return (
    <ResourceTable<FoodCategory>
      endpoint={ENDPOINTS.ADMIN.FOOD_CATEGORIES.INDEX}
      queryKey={["admin-food-categories"]}
      columns={foodCategoriesTableColumns}
      skeleton={{
        customSkeletons: {
          name: (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="bg-muted/60 h-4 w-32 animate-pulse rounded" />
                <Skeleton className="bg-muted/60 h-5 w-20 animate-pulse rounded-full" />
              </div>
              <Skeleton className="bg-muted/40 h-3 w-96 animate-pulse rounded" />
            </div>
          ),
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="bg-muted/60 h-8 w-16 animate-pulse rounded" />
              <Skeleton className="bg-muted/60 h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No food categories found. Create your first food category to get started."
      filters={<FoodCategoryFiltersDropdown isLoading={false} />}
    />
  );
}
