import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostFormSkeleton() {
  return (
    <div className="mx-auto w-full">
      <div className="space-y-6 rounded-md border border-gray-200 bg-white p-5 shadow-sm">
        <div className="space-y-5">
          <div className="space-y-5">
            {/* Thumbnail Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>

            {/* Category Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Title Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Description Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Content Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>

          {/* Actions Section Skeleton */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
