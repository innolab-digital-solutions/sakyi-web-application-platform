import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProgramFormSkeleton() {
  return (
    <div className="mx-auto w-full">
      <div className="space-y-8">
        {/* Three Column Layout - Similar to Blog Post Form */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
          {/* Left Column: Media & Pricing Skeleton */}
          <div className="space-y-6 rounded-md border border-gray-200 bg-white p-6 shadow-sm lg:col-span-1 lg:self-start">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-6">
              {/* Thumbnail */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
              {/* Background Image */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
              {/* Separator */}
              <Skeleton className="h-px w-full" />
              {/* Duration, Price */}
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Right Column: Program Information Skeleton */}
          <div className="space-y-6 rounded-md border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-6">
              {/* Tagline */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Title */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-10 w-full" />
              </div>
              {/* Overview */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-[100px] w-full" />
              </div>
              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-[120px] w-full" />
              </div>
            </div>

            {/* Content sections */}
            <div className="space-y-6 pt-6">
              {/* Target Audience Section */}
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
                <div className="space-y-4 px-4 py-5">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Key Features Section */}
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
                <div className="space-y-4 px-4 py-5">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Expected Outcomes Section */}
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
                <div className="space-y-4 px-4 py-5">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Program Structure Section */}
              <div className="overflow-hidden rounded-md border border-gray-200">
                <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
                <div className="space-y-4 px-4 py-5">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Separator */}
            <Skeleton className="my-6 h-px w-full" />

            {/* Actions Section */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
