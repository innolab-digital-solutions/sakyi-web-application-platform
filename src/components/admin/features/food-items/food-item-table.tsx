"use client";

import React from "react";

import FoodItemFiltersDropdown from "@/components/admin/features/food-items/food-item-filters-dropdown";
import { foodItemsTableColumns } from "@/components/admin/features/food-items/food-item-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { FoodItem } from "@/types/admin/food-item";

export default function FoodItemTable() {
  return (
    <ResourceTable<FoodItem>
      endpoint={ENDPOINTS.ADMIN.FOOD_ITEMS.INDEX}
      queryKey={["admin-food-items"]}
      columns={foodItemsTableColumns}
      skeleton={{
        customSkeletons: {
          name: (
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-32 animate-pulse rounded" />
              <Skeleton className="h-3 w-96 animate-pulse rounded" />
            </div>
          ),
          "category.name": <Skeleton className="h-4 w-24 animate-pulse rounded" />,
          calories_per_unit: (
            <div className="flex flex-col gap-0.5">
              <Skeleton className="h-4 w-16 animate-pulse rounded" />
              <Skeleton className="h-3 w-20 animate-pulse rounded" />
            </div>
          ),
          actions: (
            <div className="flex items-center space-x-0.5">
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No food items found. Create your first food item to get started."
      filters={({ isLoading }) => <FoodItemFiltersDropdown isLoading={isLoading} />}
    />
  );
}
