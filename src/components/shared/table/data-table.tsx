"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TablePagination from "./table-pagination";
import TableToolbar from "./table-toolbar";

interface DataTableProperties<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKeys?: string[];
  searchPlaceholder?: string;
  showPagination?: boolean;
  showColumnVisibility?: boolean;
  showRowSelection?: boolean;
  initialPageSize?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  toolbarActions?: React.ReactNode;
  showToolbar?: boolean;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  searchKeys,
  searchPlaceholder = "Search...",
  showPagination = true,
  showColumnVisibility = true,
  showRowSelection = true,
  initialPageSize = 10,
  isLoading = false,
  emptyMessage = "No results found.",
  toolbarActions,
  showToolbar = true,
}: DataTableProperties<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  return (
    <div className="border-border w-full rounded-lg border">
      {/* Toolbar with search and column visibility */}
      {showToolbar && (
        <div className="flex items-center space-x-4 px-4 py-6">
          <TableToolbar
            table={table}
            searchKeys={searchKeys}
            searchPlaceholder={searchPlaceholder}
            showColumnVisibility={showColumnVisibility}
            toolbarActions={toolbarActions}
          />
        </div>
      )}

      {/* Table */}
      <div className="border-border overflow-hidden border-y">
        <Table>
          <TableHeader className="border-border bg-muted/30 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:!bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold tracking-wide text-gray-600 !uppercase"
                  >
                    <div className="px-3.5 py-1.5">
                      {header.isPlaceholder
                        ? undefined
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <div className="px-3.5 py-1.5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="px-4 py-2">
          <TablePagination table={table} />
        </div>
      )}
    </div>
  );
}

function DataTableSkeleton() {
  return (
    <div className="border-border w-full rounded-lg border">
      <div className="p-4">
        <div className="bg-muted h-8 w-[250px] animate-pulse rounded" />
      </div>
      <div className="border-border border-y">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="border-border flex items-center space-x-4 border-b p-4 last:border-b-0"
          >
            <div className="bg-muted h-4 w-4 animate-pulse rounded" />
            <div className="bg-muted h-4 w-12 animate-pulse rounded" />
            <div className="bg-muted h-4 w-32 animate-pulse rounded" />
            <div className="bg-muted h-4 w-48 animate-pulse rounded" />
            <div className="bg-muted h-4 w-24 animate-pulse rounded" />
            <div className="bg-muted h-4 w-20 animate-pulse rounded" />
            <div className="bg-muted h-4 w-8 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
