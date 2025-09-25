"use client";

import DataTable from "@/components/shared/table/data-table";
import { Role } from "@/types/admin/role";

import { rolesColumns } from "./columns";

interface RolesTableProperties {
  data: Role[];
  isLoading?: boolean;
}

export function RolesTable({ data, isLoading = false }: RolesTableProperties) {
  return (
    <DataTable
      columns={rolesColumns}
      data={data}
      searchKeys={["name", "description"]}
      searchPlaceholder="Search roles by name or description..."
      showPagination={true}
      showColumnVisibility={true}
      initialPageSize={10}
      isLoading={isLoading}
      emptyMessage="No roles found. Create your first role to get started."
    />
  );
}
