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
          name: (
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 animate-pulse rounded" />
              <Skeleton className="h-3 w-96 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No units found. Create your first unit to get started."
    />
  );
}
