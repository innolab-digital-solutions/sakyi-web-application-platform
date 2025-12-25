import React from "react";

import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Client } from "@/types/admin/client";

import { clientsTableColumns } from "./client-table-columns";

export default function ClientTable() {
  return (
    <ResourceTable<Client>
      endpoint={ENDPOINTS.ADMIN.CLIENTS.INDEX}
      queryKey={["admin-clients"]}
      columns={clientsTableColumns}
      showColumnVisibility={true}
      skeleton={{
        customSkeletons: {
          public_id: (
            <div className="flex items-center gap-1 text-[13px] font-semibold">
              <Skeleton className="h-4 w-24 animate-pulse rounded" />
            </div>
          ),
          name: (
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 animate-pulse rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32 animate-pulse rounded" />
                <Skeleton className="h-3 w-24 animate-pulse rounded" />
              </div>
            </div>
          ),
          gender: (
            <div className="flex items-center gap-1">
              <Skeleton className="h-3.5 w-3.5 animate-pulse rounded" />
              <Skeleton className="h-4 w-12 animate-pulse rounded" />
            </div>
          ),
          "contact phone": <Skeleton className="h-4 w-28 animate-pulse rounded" />,
          "date of birth": (
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-32 animate-pulse rounded" />
              <Skeleton className="h-3 w-20 animate-pulse rounded" />
            </div>
          ),
          focus: (
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-40 animate-pulse rounded" />
              <Skeleton className="h-3 w-56 animate-pulse rounded" />
            </div>
          ),
          enrollments: (
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-32 animate-pulse rounded" />
              <Skeleton className="h-3 w-40 animate-pulse rounded" />
            </div>
          ),
          "last activity": <Skeleton className="h-4 w-40 animate-pulse rounded" />,
        },
      }}
      emptyMessage="No clients found. Enroll your first client to get started."
    />
  );
}
