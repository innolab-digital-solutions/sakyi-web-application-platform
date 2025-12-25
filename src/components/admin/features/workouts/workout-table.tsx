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
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32 animate-pulse rounded" />
                <Skeleton className="h-5 w-20 animate-pulse rounded-lg" />
              </div>
              <Skeleton className="h-3 w-96 animate-pulse rounded" />
            </div>
          ),
          "category.name": <Skeleton className="h-4 w-24 animate-pulse rounded" />,
          gif: <Skeleton className="h-12 w-12 animate-pulse rounded-md" />,
          video: <Skeleton className="h-12 w-12 animate-pulse rounded-md" />,
          equipment: <Skeleton className="h-4 w-32 animate-pulse rounded" />,
          actions: (
            <div className="flex items-center space-x-0.5">
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
