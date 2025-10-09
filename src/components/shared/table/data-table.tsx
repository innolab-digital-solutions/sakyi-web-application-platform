"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
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
import { FileSearch2 } from "lucide-react";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TablePaginationConfig,
  TableSearchConfig,
  TableServerConfig,
  TableSkeletonConfig,
  TableSortingConfig,
  TableUIConfig,
} from "@/types/shared/table";

import TableLoading from "./table-loading";
import TablePagination from "./table-pagination";
import TableToolbar from "./table-toolbar";

/**
 * Creates a global filter function for searching across multiple columns
 *
 * @template TData - The type of data in each row
 * @param searchKeys - Array of object keys to search within
 * @returns A filter function that searches the specified keys for the filter value
 */
function createGlobalFilterFunction<TData>(searchKeys: string[]) {
  return (row: Row<TData>, columnId: string, filterValue: string) => {
    if (!filterValue || searchKeys.length === 0) return true;

    const searchValue = filterValue.toLowerCase();

    // Check if any of the specified keys contain the search value
    return searchKeys.some((key) => {
      const cellValue = (row.original as Record<string, unknown>)[key];
      return cellValue ? String(cellValue).toLowerCase().includes(searchValue) : false;
    });
  };
}

/**
 * Props interface for the DataTable component
 *
 * @template TData - The type of data in each row
 * @template TValue - The type of values in the cells
 */
interface DataTableProperties<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search?: TableSearchConfig;
  pagination?: TablePaginationConfig;
  sorting?: TableSortingConfig;
  ui?: TableUIConfig;
  server?: TableServerConfig;
  skeleton?: TableSkeletonConfig;
}

/**
 * A flexible and feature-rich data table component built with TanStack Table
 *
 * This component provides:
 * - Client-side and server-side pagination
 * - Global search across multiple columns
 * - Column sorting with custom handlers and reset functionality
 * - Column visibility controls
 * - Row selection functionality
 * - Customizable toolbar and actions
 * - Loading states and empty states
 * - Responsive design with proper styling
 * - Clear sort button in toolbar
 * - Triple-click column headers to reset sorting
 *
 * Sorting Reset Features:
 * - Click column header: Sort ascending
 * - Click again: Sort descending
 * - Triple-click: Reset to default (no sorting)
 * - Clear Sort button: Reset all sorting at once
 *
 * @template TData - The type of data in each row
 * @template TValue - The type of values in the cells
 * @param props - Component properties
 * @returns A rendered data table with all configured features
 */
export default function DataTable<TData, TValue>({
  columns,
  data,
  search,
  pagination,
  sorting,
  ui,
  server,
  skeleton,
}: DataTableProperties<TData, TValue>) {
  // Merge user-provided search config with sensible defaults
  const searchConfig: Required<TableSearchConfig> = {
    keys: [],
    placeholder: "Search...",
    value: "",
    onChange: () => {},
    ...search,
  };

  // Merge user-provided pagination config with sensible defaults
  const paginationConfig: Required<TablePaginationConfig> = {
    show: true,
    pageSize: 10,
    pageCount: 0,
    totalItems: 0,
    currentPage: 0,
    onPageChange: () => {},
    onPageSizeChange: () => {},
    ...pagination,
  };

  // Merge user-provided UI config with sensible defaults
  const uiConfig: Required<TableUIConfig> = {
    showToolbar: true,
    showColumnVisibility: true,
    showRowSelection: true,
    // eslint-disable-next-line unicorn/no-null
    toolbarActions: null,
    emptyMessage: "No results found.",
    ...ui,
  };

  // Merge user-provided server config with sensible defaults
  const serverConfig: Required<TableServerConfig> = {
    enabled: false,
    loading: false,
    ...server,
  };

  // Merge user-provided skeleton config with sensible defaults
  const skeletonConfig: Required<TableSkeletonConfig> = {
    rows: 6,
    customSkeletons: {},
    ...skeleton,
  };

  // Internal state management for table features
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Initialize TanStack Table with all configurations
  const table = useReactTable({
    data,
    columns,
    // Handle sorting changes - use external handler if provided, otherwise use internal state
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(sorting?.value ?? internalSorting) : updater;

      if (sorting?.onChange) {
        sorting.onChange(next);
      } else {
        setInternalSorting(next);
      }
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Only enable client-side sorting if server-side is disabled
    ...(!serverConfig.enabled && { getSortedRowModel: getSortedRowModel() }),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    // Use external search handler if provided, otherwise use internal state
    onGlobalFilterChange: searchConfig.onChange || setGlobalFilter,
    // Use custom filter function if search keys are provided
    globalFilterFn:
      searchConfig.keys.length > 0
        ? createGlobalFilterFunction(searchConfig.keys)
        : "includesString",
    enableRowSelection: uiConfig.showRowSelection,
    enableGlobalFilter: searchConfig.keys.length > 0,
    // Enable server-side features if configured
    manualPagination: serverConfig.enabled,
    manualSorting: serverConfig.enabled,
    pageCount: paginationConfig.pageCount,
    initialState: {
      pagination: {
        pageSize: paginationConfig.pageSize,
      },
    },
    state: {
      sorting: sorting?.value ?? internalSorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: searchConfig.value ?? globalFilter,
    },
  });

  // Show loading skeleton when server is processing
  if (serverConfig.loading) {
    return (
      <TableLoading
        columns={columns}
        searchConfig={searchConfig}
        uiConfig={uiConfig}
        paginationConfig={paginationConfig}
        skeletonConfig={skeletonConfig}
      />
    );
  }

  return (
    <div className="border-border w-full overflow-hidden rounded-lg border">
      {/* Render toolbar if enabled - contains search, filters, and custom actions */}
      {uiConfig.showToolbar && (
        <div className="flex items-center space-x-4 px-4 py-6">
          <TableToolbar
            table={table}
            search={searchConfig}
            showColumnVisibility={uiConfig.showColumnVisibility}
            toolbarActions={uiConfig.toolbarActions}
            isLoading={serverConfig.loading}
          />
        </div>
      )}

      {/* Main table container with proper styling and overflow handling */}
      <div className="border-border overflow-hidden border-t">
        <Table>
          {/* Table header with sortable columns */}
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
            {/* Render data rows if available, otherwise show empty state */}
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
              // Empty state with helpful messaging and icon
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48 bg-gray-50 text-center hover:bg-gray-50"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200">
                      <FileSearch2 className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700 capitalize">
                        {uiConfig.emptyMessage || "No data available"}
                      </p>
                      <p className="text-muted-foreground mt-1 text-xs font-medium">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Render pagination if enabled and there's data to paginate */}
      {paginationConfig.show &&
        paginationConfig.totalItems !== undefined &&
        paginationConfig.totalItems > 0 && (
          <div className="border-border border-t px-4 py-2">
            <TablePagination
              table={table}
              totalItems={paginationConfig.totalItems}
              onPageChange={paginationConfig.onPageChange}
              onPageSizeChange={paginationConfig.onPageSizeChange}
              currentPage={paginationConfig.currentPage}
              pageCount={paginationConfig.pageCount}
              pageSize={paginationConfig.pageSize}
            />
          </div>
        )}
    </div>
  );
}
