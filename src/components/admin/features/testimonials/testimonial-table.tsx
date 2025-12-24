"use client";

import React from "react";

import TestimonialFiltersDropdown from "@/components/admin/features/testimonials/testimonial-filters-dropdown";
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
          "enrollment.user.name": (
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full" />
              <Skeleton className="h-3 w-40 animate-pulse rounded" />
            </div>
          ),
          "enrollment.program.name": <Skeleton className="h-4 w-40 animate-pulse rounded-lg" />,
          rating: (
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-4 animate-pulse rounded-full" />
              ))}
            </div>
          ),
          comment: <Skeleton className="h-4 w-64 animate-pulse rounded" />,
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No testimonials found. Add one to get started."
      // filters={<TestimonialFiltersDropdown />}
    />
  );
}
