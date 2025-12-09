import React from "react";

import { instructionTableColumns } from "@/components/admin/features/instructions/instruction-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Instruction } from "@/types/admin/instruction";

export default function InstructionTable() {
  return (
    <ResourceTable<Instruction>
      endpoint={ENDPOINTS.ADMIN.INSTRUCTIONS.INDEX}
      queryKey={["admin-instructions"]}
      columns={instructionTableColumns}
      skeleton={{
        customSkeletons: {
          title: (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-40 animate-pulse rounded" />
                <Skeleton className="h-5 w-20 animate-pulse rounded-full" />
              </div>
              <Skeleton className="h-3 w-80 animate-pulse rounded" />
            </div>
          ),
          enrollment: <Skeleton className="h-4 w-24 animate-pulse rounded" />,
          doctor: <Skeleton className="h-4 w-32 animate-pulse rounded" />,
          total_days: <Skeleton className="h-4 w-28 animate-pulse rounded" />,
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-8 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No instructions found. Create your first instruction to get started."
    />
  );
}
