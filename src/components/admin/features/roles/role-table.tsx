import { rolesTableColumns } from "@/components/admin/features/roles/role-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Role } from "@/types/admin/role";

export default function RoleTable() {
  return (
    <ResourceTable<Role>
      endpoint={ENDPOINTS.ADMIN.ROLES.INDEX}
      queryKey={["admin-roles"]}
      columns={rolesTableColumns}
      skeleton={{
        customSkeletons: {
          name: (
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 animate-pulse rounded" />
              <Skeleton className="h-3 w-96 animate-pulse rounded" />
            </div>
          ),
          users: (
            <div className="flex items-center">
              <div className="flex -space-x-2">
                <Skeleton className="h-8 w-8 animate-pulse rounded-full border border-gray-100" />
                <Skeleton className="h-8 w-8 animate-pulse rounded-full border border-gray-100" />
                <Skeleton className="h-8 w-8 animate-pulse rounded-full border border-gray-100" />
                <Skeleton className="h-8 w-8 animate-pulse rounded-full border border-gray-100" />
              </div>
            </div>
          ),
          permissions: (
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 animate-pulse rounded-full" />
              <Skeleton className="h-6 w-20 animate-pulse rounded-full" />
              <Skeleton className="h-6 w-12 animate-pulse rounded-full" />
            </div>
          ),
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-8 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No roles found. Create your first role to get started."
    />
  );
}
