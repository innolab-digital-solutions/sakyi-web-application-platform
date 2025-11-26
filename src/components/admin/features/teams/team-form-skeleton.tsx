import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function TeamFormSkeleton() {
  return (
    <div className="mx-auto w-full">
      <div className="space-y-6 rounded-md border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Left Column: Team Info */}
          <div className="space-y-4">
            {/* Team Name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Assign User */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Right Column: Description */}
          <div className="space-y-4">
            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </div>
        </div>

        {/* Actions Section Skeleton */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
