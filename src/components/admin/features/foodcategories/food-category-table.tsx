"use client";

import React from "react";

import DataTable from "@/components/shared/table/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { useTable } from "@/hooks/use-table";
import { FoodCategory } from "@/types/admin/food-category";

import FoodCategoryFiltersDropdown from "./food-category-filters-dropdown";
import { foodCategoriesTableColumns } from "./food-category-table-columns";

export default function FoodCategoryTable() {
  const { data, searchConfig, paginationConfig, sortingConfig, serverConfig } =
    useTable<FoodCategory>({
      endpoint: ENDPOINTS.ADMIN.FOOD_CATEGORIES.INDEX,
      queryKey: ["admin-food-categories"],
      defaultSort: { field: "id", direction: "desc" },
    });

  return (
    <DataTable
      columns={foodCategoriesTableColumns}
      data={data}
      search={searchConfig}
      pagination={paginationConfig}
      sorting={sortingConfig}
      server={serverConfig}
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
      ui={{
        emptyMessage: "No food categories found. Create your first food category to get started.",
        showColumnVisibility: false,
        showToolbar: true,
        toolbarActions: (
          <>
            <FoodCategoryFiltersDropdown isLoading={serverConfig.loading} />
          </>
        ),
      }}
    />
  );
}
