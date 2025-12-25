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
          name: (
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 animate-pulse rounded" />
              <Skeleton className="h-3 w-96 animate-pulse rounded" />
            </div>
          ),
          members: (
            <div className="flex items-center">
              <div className="flex -space-x-2">
                <Skeleton className="h-8 w-8 animate-pulse rounded-full border border-gray-100" />
                <Skeleton className="h-8 w-8 animate-pulse rounded-full border border-gray-100" />
                <Skeleton className="h-8 w-8 animate-pulse rounded-full border border-gray-100" />
                <Skeleton className="h-8 w-8 animate-pulse rounded-full border border-gray-100" />
              </div>
            </div>
          ),
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="bg-muted/60 h-8 w-16 animate-pulse rounded" />
              <Skeleton className="bg-muted/60 h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No teams found. Add one to get started."
    />
  );
}
