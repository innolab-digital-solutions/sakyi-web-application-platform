import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

interface BlogCardSkeletonProperties {
  index?: number;
  className?: string;
}

export default function BlogCardSkeleton({ index = 0, className = "" }: BlogCardSkeletonProperties) {
  return (
    <div
      className={`group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}
      data-aos="fade-up"
      data-aos-delay={`${index * 150}`}
    >
      <div className="space-y-6">
        <div className="relative w-full overflow-hidden rounded-xl">
          <Skeleton className="aspect-[16/10] w-full" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>

        <Skeleton className="h-6 w-3/4 rounded-lg" />

<div className="flex flex-col gap-2">

        <Skeleton className="h-3 w-full rounded-lg" />
        <Skeleton className="h-3 w-5/6 rounded-lg" />
</div>

        <Skeleton className="h-4 w-32 rounded-full" />
      </div>
    </div>
  );
}