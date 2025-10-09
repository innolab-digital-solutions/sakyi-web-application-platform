"use client";

import DataTable from "@/components/shared/table/data-table";
import { ENDPOINTS } from "@/config/endpoints";
import { useTable } from "@/hooks/use-table";
import { Unit } from "@/types/admin/unit";

import { unitsTableColumns } from "./unit-table-columns";

export default function UnitTable() {
  const { data, searchConfig, paginationConfig, sortingConfig, serverConfig } = useTable<Unit>({
    endpoint: ENDPOINTS.ADMIN.UNITS.INDEX,
    queryKey: ["admin-units"],
    defaultSort: { field: "id", direction: "desc" },
  });

  return (
    <DataTable
      columns={unitsTableColumns}
      data={data}
      search={searchConfig}
      pagination={paginationConfig}
      sorting={sortingConfig}
      server={serverConfig}
      ui={{
        emptyMessage: "No units found. Create your first unit to get started.",
        showColumnVisibility: false,
      }}
    />
  );
}
