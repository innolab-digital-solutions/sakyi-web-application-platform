"use client";

import React from "react";

import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Enrollment } from "@/types/admin/enrollment";

import EnrollmentFiltersDropdown from "./enrollment-filters-dropdown";
import { enrollmentsTableColumns } from "./enrollment-table-columns";

export default function EnrollmentTable() {
  return (
    <ResourceTable<Enrollment>
      endpoint={ENDPOINTS.ADMIN.ENROLLMENTS.INDEX}
      queryKey={["admin-enrollments"]}
      columns={enrollmentsTableColumns}
      skeleton={{
        customSkeletons: {
          user: <Skeleton className="h-5 w-32 animate-pulse rounded" />,
          team: <Skeleton className="h-5 w-28 animate-pulse rounded" />,
          program: <Skeleton className="h-5 w-36 animate-pulse rounded" />,
          status: <Skeleton className="h-5 w-20 animate-pulse rounded" />,
          started_at: <Skeleton className="h-5 w-24 animate-pulse rounded" />,
          ended_at: <Skeleton className="h-5 w-24 animate-pulse rounded" />,
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No enrollments found. Create your first enrollment to get started."
      filters={<EnrollmentFiltersDropdown isLoading={false} />}
    />
  );
}
