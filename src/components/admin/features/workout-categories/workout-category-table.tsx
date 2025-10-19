import React from "react";

import WorkoutCategoryFiltersDropdown from "@/components/admin/features/workout-categories/workout-category-filters-dropdown";
import { workoutCategoryTableColumns } from "@/components/admin/features/workout-categories/workout-category-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { WorkoutCategory } from "@/types/admin/workout-category";

export default function WorkoutCategoryTable() {
  return (
    <ResourceTable<WorkoutCategory>
      endpoint={ENDPOINTS.ADMIN.WORKOUT_CATEGORIES.INDEX}
      queryKey={["admin-workout-categories"]}
      columns={workoutCategoryTableColumns}
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
      emptyMessage="No workout categories found. Create your first workout category to get started."
      filters={<WorkoutCategoryFiltersDropdown isLoading={false} />}
    />
  );
}
