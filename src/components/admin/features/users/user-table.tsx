import React from "react";

import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { User } from "@/types/admin/user";

import UserFiltersDropdown from "./user-filters-dropdown";
import { usersTableColumns } from "./user-table-columns";

export default function UserTable() {
  return (
    <ResourceTable<User>
      endpoint={ENDPOINTS.ADMIN.USERS.INDEX}
      queryKey={["admin-users"]}
      columns={usersTableColumns}
      showColumnVisibility={true}
      skeleton={{
        customSkeletons: {
          title: (
            <div className="flex min-w-0 items-start gap-4">
              <div className="ring-muted-foreground/5 bg-muted relative size-12 shrink-0 animate-pulse overflow-hidden rounded-md ring-1" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-40 animate-pulse rounded" />
                  <Skeleton className="h-5 w-16 animate-pulse rounded-full" />
                </div>
                <Skeleton className="h-3 w-80 animate-pulse rounded" />
              </div>
            </div>
          ),
          onboarding_form: <Skeleton className="h-4 w-80 animate-pulse rounded" />,
          duration_value: <Skeleton className="h-4 w-20 animate-pulse rounded" />,
          price: <Skeleton className="h-4 w-24 animate-pulse rounded" />,
          status: <Skeleton className="h-4 w-8 animate-pulse rounded-lg" />,
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-8 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No users found. Create your first user to get started."
      filters={<UserFiltersDropdown />}
    />
  );
}
