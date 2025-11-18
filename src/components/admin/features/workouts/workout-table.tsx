"use client";

import React from "react";

import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Workout } from "@/types/admin/workout";

import WorkoutFiltersDropdown from "./workout-filters-dropdown";
import { workoutsTableColumns } from "./workout-table-columns";

export default function WorkoutTable() {
  return (
    <ResourceTable<Workout>
      endpoint={ENDPOINTS.ADMIN.WORKOUTS.INDEX}
      queryKey={["admin-workouts"]}
      columns={workoutsTableColumns}
      skeleton={{
        customSkeletons: {
          name: (
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 flex-shrink-0 animate-pulse rounded-md" />
              <Skeleton className="h-3 w-96 animate-pulse rounded" />
            </div>
          ),
          category: <Skeleton className="h-5 w-32 animate-pulse rounded-lg" />,
          difficulty: <Skeleton className="h-5 w-24 animate-pulse rounded-lg" />,
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No workouts found. Add a new workout to get started."
      filters={
        <>
          <WorkoutFiltersDropdown />
        </>
      }
    />
  );
}
