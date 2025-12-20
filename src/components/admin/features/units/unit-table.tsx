import { unitsTableColumns } from "@/components/admin/features/units/unit-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Unit } from "@/types/admin/unit";

export default function UnitTable() {
  return (
    <ResourceTable<Unit>
      endpoint={ENDPOINTS.ADMIN.UNITS.INDEX}
      queryKey={["admin-units"]}
      columns={unitsTableColumns}
      skeleton={{
        customSkeletons: {
          name: <Skeleton className="h-4 w-40 animate-pulse rounded" />,
          abbreviation: <Skeleton className="h-4 w-20 animate-pulse rounded" />,
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No units found. Create your first unit to get started."
    />
  );
}
