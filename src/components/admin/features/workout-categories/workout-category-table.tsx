"use client";

import React from "react";

import WorkoutCategoryFiltersDropdown from "@/components/admin/features/workout-categories/workout-category-filters-dropdown";
import { workoutCategoryTableColumns } from "@/components/admin/features/workout-categories/workout-category-table-columns";
import DataTable from "@/components/shared/table/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { useTable } from "@/hooks/use-table";
import { WorkoutCategory } from "@/types/admin/workout-category";

export default function WorkoutCategoryTable() {
  const { data, searchConfig, paginationConfig, sortingConfig, serverConfig } =
    useTable<WorkoutCategory>({
      endpoint: ENDPOINTS.ADMIN.WORKOUT_CATEGORIES.INDEX,
      queryKey: ["admin-workout-categories"],
      defaultSort: { field: "id", direction: "desc" },
    });

  return (
    <DataTable
      columns={workoutCategoryTableColumns}
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
                <Skeleton className="h-4 w-32 animate-pulse rounded" />
                <Skeleton className="h-5 w-20 animate-pulse rounded-full" />
              </div>
              <Skeleton className="h-3 w-96 animate-pulse rounded" />
            </div>
          ),
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      ui={{
        emptyMessage:
          "No workout categories found. Create your first workout category to get started.",
        showColumnVisibility: false,
        showToolbar: true,
        toolbarActions: (
          <>
            <WorkoutCategoryFiltersDropdown isLoading={serverConfig.loading} />
          </>
        ),
      }}
    />
  );
}
