"use client";

import React from "react";

import DataTable from "@/components/shared/table/data-table";
import { useTable } from "@/hooks/use-table";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ResourceTableProperties<TData> {
  endpoint: string;
  queryKey: string[];
  columns: unknown;
  defaultSort?: { field: string; direction: "asc" | "desc" };
  emptyMessage?: string;
  filters?: React.ReactNode;
  skeleton?: {
    customSkeletons?: Record<string, React.ReactNode>;
  };
}

export default function ResourceTable<TData>({
  endpoint,
  queryKey,
  columns,
  defaultSort = { field: "id", direction: "desc" },
  emptyMessage = "No records found.",
  filters,
  skeleton,
}: ResourceTableProperties<TData>) {
  const { data, searchConfig, paginationConfig, sortingConfig, serverConfig } = useTable<TData>({
    endpoint,
    queryKey,
    defaultSort,
  });

  return (
    <DataTable
      columns={columns as never}
      data={data}
      search={searchConfig}
      pagination={paginationConfig}
      sorting={sortingConfig}
      server={serverConfig}
      skeleton={skeleton}
      ui={{
        emptyMessage,
        showColumnVisibility: false,
        toolbarActions: filters,
        showToolbar: true,
      }}
    />
  );
}
