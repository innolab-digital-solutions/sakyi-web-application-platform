"use client";

import React from "react";

import { workoutTableColumns } from "@/components/admin/features/workouts/workout-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Workout } from "@/types/admin/workout";

import WorkoutFiltersDropdown from "./workout-filters-dropdown";

export default function WorkoutTable() {
  return (
    <ResourceTable<Workout>
      endpoint={ENDPOINTS.ADMIN.WORKOUTS.INDEX}
      queryKey={["admin-workouts"]}
      columns={workoutTableColumns}
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
      emptyMessage="No workouts found. Create your first workout to get started."
      filters={<WorkoutFiltersDropdown isLoading={false} />}
    />
  );
}
