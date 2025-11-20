import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

interface TestimonialSkeletonProperties {
  index?: number;
  className?: string;
}

export default function TestimonialSkeleton({
  index = 0,
  className = "",
}: TestimonialSkeletonProperties) {
  return (
    <div
      className={`flex h-80 flex-col justify-between text-center ${className}`}
      data-aos="fade-up"
      data-aos-delay={`${index * 150}`}
    >
      {/* Quote Section */}
      <div className="flex flex-1 items-center justify-center px-2">
        <div className="w-full space-y-4 text-center">
          {/* Star Rating Skeleton */}
          <div className="flex justify-center">
            <div className="flex space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-4 rounded" />
              ))}
            </div>
          </div>
          {/* Quote Skeleton */}
          <div className="space-y-2">
            <Skeleton className="mx-auto h-4 w-full max-w-md rounded-lg" />
            <Skeleton className="mx-auto h-4 w-5/6 max-w-md rounded-lg" />
            <Skeleton className="mx-auto h-4 w-4/6 max-w-md rounded-lg" />
          </div>
        </div>
      </div>

      {/* Client Info Skeleton */}
      <div className="flex flex-col items-center space-y-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 text-center">
          <Skeleton className="h-4 w-24 rounded-lg" />
          <Skeleton className="h-3 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

