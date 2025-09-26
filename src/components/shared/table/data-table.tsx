"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterMeta,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
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

// Global filter function for multi-column search
function createGlobalFilterFunction<TData>(searchKeys: string[]) {
  return (
    row: Row<TData>,
    columnId: string,
    filterValue: string,
    _addMeta: (meta: FilterMeta) => void,
  ) => {
    if (!filterValue || searchKeys.length === 0) return true;

    const searchValue = filterValue.toLowerCase();

    return searchKeys.some((key) => {
      // Get value from original data to avoid column existence issues
      const cellValue = (row.original as Record<string, unknown>)[key];
      const matches = cellValue ? String(cellValue).toLowerCase().includes(searchValue) : false;

      // Debug logging (remove in production)
      if (process.env.NODE_ENV === "development" && filterValue) {
        // eslint-disable-next-line no-console
        console.log(`Searching ${key}: "${cellValue}" includes "${searchValue}"? ${matches}`);
      }

      return matches;
    });
  };
}

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
  // server mode controls
  manual?: boolean;
  pageCount?: number;
  totalItems?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  sortingValue?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  searchKeys = [],
  searchPlaceholder = "Search...",
  showPagination = true,
  showColumnVisibility = true,
  showRowSelection = true,
  initialPageSize = 10,
  isLoading = false,
  emptyMessage = "No results found.",
  toolbarActions,
  showToolbar = true,
  manual = false,
  pageCount,
  totalItems,
  onPageChange,
  onPageSizeChange,
  searchValue,
  onSearchChange,
  sortingValue,
  onSortingChange,
}: DataTableProperties<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState(""); // Add global filter state

  const table = useReactTable({
    data,
    columns,
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function"
          ? (updater as (old: SortingState) => SortingState)(sorting)
          : updater;
      setSorting(next);
      if (onSortingChange) onSortingChange(next);
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    ...(manual ? {} : { getSortedRowModel: getSortedRowModel() }),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn:
      searchKeys.length > 0 ? createGlobalFilterFunction(searchKeys) : "includesString",
    enableRowSelection: showRowSelection,
    enableGlobalFilter: searchKeys.length > 0,
    manualPagination: manual,
    manualSorting: manual,
    pageCount: manual ? pageCount : undefined,
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    state: {
      sorting: sortingValue ?? sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: searchValue ?? globalFilter,
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
            value={searchValue}
            onChange={onSearchChange}
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
          <TablePagination
            table={table}
            totalItems={totalItems}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
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
