"use client";

import { rolesTableColumns } from "@/components/admin/features/roles/role-table-columns";
import DataTable from "@/components/shared/table/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { useTable } from "@/hooks/use-table";
import { Role } from "@/types/admin/role";

export default function RoleTable() {
  const { data, searchConfig, paginationConfig, sortingConfig, serverConfig } = useTable<Role>({
    endpoint: ENDPOINTS.ADMIN.ROLES.INDEX,
    queryKey: ["admin-roles"],
    defaultSort: { field: "id", direction: "desc" },
  });

  return (
    <DataTable
      columns={rolesTableColumns}
      data={data}
      search={searchConfig}
      pagination={paginationConfig}
      sorting={sortingConfig}
      server={serverConfig}
      skeleton={{
        customSkeletons: {
          name: (
            <div className="space-y-2">
              <Skeleton className="bg-muted/60 h-4 w-32 animate-pulse rounded" />
              <Skeleton className="bg-muted/40 h-3 w-96 animate-pulse rounded" />
            </div>
          ),
          permissions: (
            <div className="flex items-center gap-2">
              <Skeleton className="bg-muted/60 h-6 w-16 animate-pulse rounded-full" />
              <Skeleton className="bg-muted/60 h-6 w-20 animate-pulse rounded-full" />
              <Skeleton className="bg-muted/60 h-6 w-12 animate-pulse rounded-full" />
            </div>
          ),
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="bg-muted/60 h-8 w-8 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      ui={{
        emptyMessage: "No roles found. Create your first role to get started.",
        showColumnVisibility: false,
      }}
    />
  );
}
