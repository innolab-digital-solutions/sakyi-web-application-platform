"use client";

import DataTable from "@/components/shared/table/data-table";
import { ENDPOINTS } from "@/config/endpoints";
import { useTable } from "@/hooks/use-table";
import { Role } from "@/types/admin/role";

import { rolesColumns } from "./columns";

export function RolesTable() {
  const { data, searchConfig, paginationConfig, sortingConfig, serverConfig } = useTable<Role>({
    endpoint: ENDPOINTS.ADMIN.ROLES.INDEX,
    queryKey: ["admin-roles"],
    defaultSort: { field: "id", direction: "desc" },
  });

  return (
    <DataTable
      columns={rolesColumns}
      data={data}
      search={searchConfig}
      pagination={paginationConfig}
      sorting={sortingConfig}
      server={serverConfig}
      ui={{
        emptyMessage: "No roles found. Create your first role to get started.",
        showColumnVisibility: false,
      }}
    />
  );
}
