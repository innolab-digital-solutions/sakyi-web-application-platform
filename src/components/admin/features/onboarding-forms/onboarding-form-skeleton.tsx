import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingFormSkeleton() {
  return (
    <div className="mx-auto w-full">
      <div className="space-y-6 rounded-md border border-gray-200 p-6">
        {/* Basic Information Section */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-5">
            {/* Title Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-[92px] w-full" />
            </div>

            {/* Status Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Separator */}
        <Skeleton className="h-px w-full" />

        {/* Sections Section */}
        <div className="space-y-5">
          {/* Sections Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="h-8 w-28" />
          </div>

          {/* Section Collapsible (at least one section shown) */}
          <div className="overflow-hidden rounded-md border border-gray-200">
            {/* Section Header */}
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>

            {/* Section Content */}
            <div className="space-y-4 px-4 py-5">
              {/* Section Title and Description (2 columns) */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Separator */}
              <Skeleton className="h-px w-full" />

              {/* Questions Header */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-8 w-32" />
              </div>

              {/* Questions (at least one question shown) */}
              <div className="space-y-5">
                <div className="space-y-4">
                  {/* Question and Type (2 columns) */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>

                  {/* Required Checkbox + Delete Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Skeleton className="my-6 h-px w-full" />

        {/* Actions Section */}
        <div className="flex items-center justify-end gap-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    </div>
  );
}
