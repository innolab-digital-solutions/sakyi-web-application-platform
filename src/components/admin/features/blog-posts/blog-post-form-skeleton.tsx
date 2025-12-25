import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostFormSkeleton() {
  return (
    <div className="mx-auto w-full">
      {/* Match blog post form two-column layout */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          {/* Left Column: Thumbnail + Status Card */}
          <div className="space-y-6 rounded-md border border-gray-200 bg-white p-5 shadow-sm lg:col-span-1 lg:self-start">
            {/* Thumbnail Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>

            {/* Status Card Skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-32" />
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-6 w-11 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right Column: Category, Title, Description, Content + Actions */}
          <div className="space-y-6 rounded-md border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
            {/* Category Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Title Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Description Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Content Field Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-[300px] w-full" />
            </div>

            {/* Actions Section Skeleton */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-5">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
