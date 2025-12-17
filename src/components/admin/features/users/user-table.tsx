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
          name: (
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 animate-pulse rounded-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32 animate-pulse rounded" />
                <Skeleton className="h-5 w-16 animate-pulse rounded-full" />
              </div>
            </div>
          ),
          email: <Skeleton className="h-4 w-48 animate-pulse rounded" />,
          phone: <Skeleton className="h-4 w-28 animate-pulse rounded" />,
          dob: <Skeleton className="h-4 w-32 animate-pulse rounded" />,
          gender: (
            <div className="flex items-center gap-1">
              <Skeleton className="h-3.5 w-3.5 animate-pulse rounded" />
              <Skeleton className="h-4 w-12 animate-pulse rounded" />
            </div>
          ),
          address: <Skeleton className="h-4 w-40 animate-pulse rounded" />,
          "created at": <Skeleton className="h-4 w-36 animate-pulse rounded" />,
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
