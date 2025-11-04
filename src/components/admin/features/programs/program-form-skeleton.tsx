import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProgramFormSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {/* PageHeader Skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <Skeleton className="mt-1 h-5 w-5" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-96" />
            </div>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Basic Details Section Skeleton */}
        <div className="h-fit space-y-5 rounded-md border border-gray-200 p-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-5">
            {/* Thumbnail */}
            <Skeleton className="h-24 w-full rounded-md" />
            {/* Title */}
            <Skeleton className="h-10 w-full" />
            {/* Description */}
            <Skeleton className="h-24 w-full" />
            {/* Duration & Unit */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            {/* Price */}
            <Skeleton className="h-10 w-full" />
            {/* Onboarding Form */}
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        {/* Content Sections Skeleton */}
        <div className="space-y-5">
          {/* Ideals Section */}
          <div className="overflow-hidden rounded-md border border-gray-200">
            <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
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
                <Skeleton className="h-5 w-32" />
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
                <Skeleton className="h-5 w-40" />
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

          {/* Structures Section */}
          <div className="overflow-hidden rounded-md border border-gray-200">
            <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
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

          {/* FAQs Section */}
          <div className="overflow-hidden rounded-md border border-gray-200">
            <div className="flex flex-col gap-2 bg-gray-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
            <div className="space-y-4 px-4 py-5">
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>

          {/* Submit Button Area */}
          <div className="flex items-center justify-end gap-2 pt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
