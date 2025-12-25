"use client";

import React from "react";

import { enrollmentsTableColumns } from "@/components/admin/features/enrollments/enrollment-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Enrollment } from "@/types/admin/enrollment";

export default function EnrollmentTable() {
  return (
    <ResourceTable<Enrollment>
      endpoint={ENDPOINTS.ADMIN.ENROLLMENTS.INDEX}
      queryKey={["admin-enrollments"]}
      columns={enrollmentsTableColumns}
      showColumnVisibility={true}
      skeleton={{
        customSkeletons: {
          code: <Skeleton className="h-4 w-32 animate-pulse rounded" />,
          program: (
            <div className="flex items-center gap-2">
              <Skeleton className="size-12 shrink-0 animate-pulse rounded-md" />
              <Skeleton className="h-4 w-40 animate-pulse rounded" />
            </div>
          ),
          client: (
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 animate-pulse rounded-full" />
              <Skeleton className="h-4 w-32 animate-pulse rounded" />
            </div>
          ),
          "assigned team": <Skeleton className="h-4 w-32 animate-pulse rounded" />,
          "starts at": <Skeleton className="h-5 w-32 animate-pulse rounded" />,
          "ends at": <Skeleton className="h-5 w-32 animate-pulse rounded" />,
          status: <Skeleton className="h-5 w-20 animate-pulse rounded-full" />,
          "completed at": <Skeleton className="h-5 w-32 animate-pulse rounded" />,
          "cancelled at": <Skeleton className="h-5 w-32 animate-pulse rounded" />,
          "created at": <Skeleton className="h-4 w-32 animate-pulse rounded" />,
        },
      }}
      emptyMessage="No enrollments found. Enroll a client into a program to get started."
    />
  );
}
