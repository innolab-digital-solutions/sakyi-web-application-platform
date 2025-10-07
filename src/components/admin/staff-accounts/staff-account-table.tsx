"use client";

import React from "react";

import DataTable from "@/components/shared/table/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { useTable } from "@/hooks/use-table";
import { StaffAccount } from "@/types/admin/staff-account";

import StaffAccountFiltersDropdown from "./staff-account-filters-dropdown";
import { staffAccountTableColumns } from "./staff-account-table-columns";

export default function StaffAccountTable() {
  const { data, searchConfig, paginationConfig, sortingConfig, serverConfig } =
    useTable<StaffAccount>({
      endpoint: ENDPOINTS.ADMIN.STAFF_ACCOUNTS.INDEX,
      queryKey: ["admin-staff-accounts"],
      defaultSort: { field: "id", direction: "desc" },
    });

  return (
    <DataTable
      columns={staffAccountTableColumns}
      data={data}
      search={searchConfig}
      pagination={paginationConfig}
      sorting={sortingConfig}
      server={serverConfig}
      skeleton={{
        customSkeletons: {
          name: (
            <div className="flex items-center gap-3">
              <Skeleton className="bg-muted/60 size-9 animate-pulse rounded-full" />
              <div className="flex min-w-0 flex-col gap-1">
                <Skeleton className="bg-muted/60 h-4 w-28 animate-pulse rounded" />
                <Skeleton className="bg-muted/40 h-3 w-16 animate-pulse rounded" />
              </div>
            </div>
          ),
          email: <Skeleton className="bg-muted/40 h-4 w-40 animate-pulse rounded" />,
          phone: <Skeleton className="bg-muted/40 h-4 w-24 animate-pulse rounded" />,
          status: <Skeleton className="bg-muted/30 h-5 w-16 animate-pulse rounded-full" />,
          dob: <Skeleton className="bg-muted/30 h-4 w-24 animate-pulse rounded" />,
          gender: <Skeleton className="bg-muted/30 h-4 w-16 animate-pulse rounded" />,
          address: <Skeleton className="bg-muted/30 h-4 w-44 animate-pulse rounded" />,
          actions: (
            <div className="flex items-center gap-1">
              <Skeleton className="bg-muted/60 h-8 w-8 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      ui={{
        emptyMessage: "No staff accounts found. Create your first staff account to get started.",
        showColumnVisibility: true,
        showToolbar: true,
        toolbarActions: (
          <>
            <StaffAccountFiltersDropdown isLoading={serverConfig.loading} />
          </>
        ),
      }}
    />
  );
}
