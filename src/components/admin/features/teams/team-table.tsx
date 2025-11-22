"use client";

import React from "react";

import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Team } from "@/types/admin/team";

import { teamsTableColumns } from "./team-table-columns";

export default function TeamTable() {
  return (
    <ResourceTable<Team>
      endpoint={ENDPOINTS.ADMIN.TEAMS.INDEX}
      queryKey={["admin-teams"]}
      columns={teamsTableColumns}
      skeleton={{
        customSkeletons: {
          name: <Skeleton className="h-4 w-40 animate-pulse rounded" />,
          description: <Skeleton className="h-4 w-64 animate-pulse rounded" />,
          users: (
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 animate-pulse rounded-lg" />
            </div>
          ),
          created_at: <Skeleton className="h-4 w-24 animate-pulse rounded" />,
        },
      }}
      emptyMessage="No teams found. Add one to get started."
    />
  );
}
