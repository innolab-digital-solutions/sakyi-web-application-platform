"use client";

import React from "react";

import { testimonialsTableColumns } from "@/components/admin/features/testimonials/testimonial-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Testimonial } from "@/types/admin/testimonial";

export default function TestimonialTable() {
  return (
    <ResourceTable<Testimonial>
      endpoint={ENDPOINTS.ADMIN.TESTIMONIALS.INDEX}
      queryKey={["admin-testimonials"]}
      columns={testimonialsTableColumns}
      skeleton={{
        customSkeletons: {
          reviewer: (
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 animate-pulse rounded-full" />
              <Skeleton className="h-4 w-32 animate-pulse rounded" />
            </div>
          ),
          rating: (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-4 animate-pulse rounded-full" />
              ))}
              <Skeleton className="ml-1 h-5 w-12 animate-pulse rounded-full" />
            </div>
          ),
          comment: <Skeleton className="h-4 w-64 animate-pulse rounded" />,
          actions: (
            <div className="flex items-center space-x-0.5">
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No testimonials found. Add one to get started."
    />
  );
}
