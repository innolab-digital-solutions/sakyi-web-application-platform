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

import { Skeleton } from "@/components/ui/skeleton";
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
  TableSortingConfig,
  TableUIConfig,
} from "@/types/shared/table";

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
      // eslint-disable-next-line security/detect-object-injection
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
}

/**
 * A flexible and feature-rich data table component built with TanStack Table
 *
 * This component provides:
 * - Client-side and server-side pagination
 * - Global search across multiple columns
 * - Column sorting with custom handlers
 * - Column visibility controls
 * - Row selection functionality
 * - Customizable toolbar and actions
 * - Loading states and empty states
 * - Responsive design with proper styling
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
      <DataTableSkeleton
        columns={columns}
        searchConfig={searchConfig}
        uiConfig={uiConfig}
        paginationConfig={paginationConfig}
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                      <FileSearch2 className="text-muted-foreground h-5 w-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm font-medium">
                        {uiConfig.emptyMessage || "No data available"}
                      </p>
                      <p className="text-muted-foreground/80 mt-1 text-xs">
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

/**
 * Loading skeleton component displayed while server data is being fetched
 *
 * Provides a realistic placeholder that matches the actual table structure
 * with animated skeleton elements for better user experience
 *
 * @template TData - The type of data in each row
 * @template TValue - The type of values in the cells
 * @param props - Component properties
 * @returns A skeleton loader component with table-like structure
 */
function DataTableSkeleton<TData, TValue>({
  columns,
  searchConfig,
  uiConfig,
  paginationConfig,
}: {
  columns: ColumnDef<TData, TValue>[];
  searchConfig: Required<TableSearchConfig>;
  uiConfig: Required<TableUIConfig>;
  paginationConfig?: Required<TablePaginationConfig>;
}) {
  return (
    <div className="border-border w-full overflow-hidden rounded-lg border">
      {/* Render toolbar if enabled - keep search and filters visible */}
      {uiConfig.showToolbar && (
        <div className="flex items-center space-x-4 px-4 py-6">
          <TableToolbar
            table={undefined} // Pass undefined since we're in loading state
            search={searchConfig}
            showColumnVisibility={uiConfig.showColumnVisibility}
            toolbarActions={uiConfig.toolbarActions}
            isLoading={true}
          />
        </div>
      )}

      {/* Main table container with skeleton rows */}
      <div className="border-border overflow-hidden border-t">
        <Table>
          {/* Table header - keep headers visible */}
          <TableHeader className="border-border bg-muted/30 border-b">
            <TableRow className="hover:!bg-transparent">
              {columns.map((column, index) => (
                <TableHead
                  key={column.id || index}
                  className="text-xs font-semibold tracking-wide text-gray-600 !uppercase"
                >
                  <div className="px-3.5 py-1.5">
                    {typeof column.header === "string" ? column.header : "Loading..."}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Dynamic skeleton rows based on page size or default */}
            {Array.from({
              length: paginationConfig?.pageSize || 6,
            }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-muted/40 transition-colors">
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="px-3.5 py-1.5">
                      <SkeletonRowContent column={column} rowIndex={rowIndex} />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/**
 * Skeleton content for individual cells based on column type and structure
 */
function SkeletonRowContent<TData, TValue>({
  column,
  rowIndex,
}: {
  column: ColumnDef<TData, TValue>;
  rowIndex: number;
}) {
  // Add some variation to make it look more realistic
  const variations = [
    { width: "w-24", height: "h-4" },
    { width: "w-32", height: "h-4" },
    { width: "w-20", height: "h-4" },
    { width: "w-28", height: "h-4" },
    { width: "w-16", height: "h-4" },
    { width: "w-36", height: "h-4" },
  ];

  const variation = variations[rowIndex % variations.length];

  // Get column header text for analysis
  const headerText = typeof column.header === "string" ? column.header.toLowerCase() : "";
  const columnId = column.id?.toLowerCase() || "";

  // 1. Actions column - typically has buttons/links
  if (columnId.includes("action") || headerText.includes("action")) {
    return (
      <div className="flex items-center space-x-3">
        <Skeleton
          className={`bg-muted/60 ${variation.width} ${variation.height} animate-pulse rounded`}
        />
        <Skeleton
          className={`bg-muted/60 ${variation.width} ${variation.height} animate-pulse rounded`}
        />
      </div>
    );
  }

  // 2. Badge/Tag columns - permissions, status, categories, etc.
  if (
    headerText.includes("permission") ||
    headerText.includes("status") ||
    headerText.includes("category") ||
    headerText.includes("tag") ||
    headerText.includes("type") ||
    columnId.includes("status") ||
    columnId.includes("category")
  ) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="bg-muted/60 h-6 w-16 animate-pulse rounded-full" />
        <Skeleton className="bg-muted/60 h-6 w-20 animate-pulse rounded-full" />
        <Skeleton className="bg-muted/60 h-6 w-12 animate-pulse rounded-full" />
      </div>
    );
  }

  // 3. Name/Title columns with descriptions - roles, posts, users, etc.
  if (
    headerText.includes("name") ||
    headerText.includes("title") ||
    headerText.includes("role") ||
    headerText.includes("user") ||
    headerText.includes("post") ||
    headerText.includes("product") ||
    columnId.includes("name") ||
    columnId.includes("title")
  ) {
    return (
      <div className="space-y-2">
        <Skeleton
          className={`bg-muted/60 ${variation.width} ${variation.height} animate-pulse rounded`}
        />
        <Skeleton className={`bg-muted/40 h-3 w-20 animate-pulse rounded`} />
      </div>
    );
  }

  // 4. Email columns
  if (headerText.includes("email") || columnId.includes("email")) {
    return (
      <div className="space-y-1">
        <Skeleton className="bg-muted/60 h-4 w-40 animate-pulse rounded" />
        <Skeleton className="bg-muted/40 h-3 w-32 animate-pulse rounded" />
      </div>
    );
  }

  // 5. Date/Time columns
  if (
    headerText.includes("date") ||
    headerText.includes("time") ||
    headerText.includes("created") ||
    headerText.includes("updated") ||
    columnId.includes("date") ||
    columnId.includes("time")
  ) {
    return (
      <div className="space-y-1">
        <Skeleton className="bg-muted/60 h-4 w-24 animate-pulse rounded" />
        <Skeleton className="bg-muted/40 h-3 w-16 animate-pulse rounded" />
      </div>
    );
  }

  // 6. ID columns - usually shorter
  if (headerText.includes("id") || columnId.includes("id")) {
    return <Skeleton className="bg-muted/60 h-4 w-12 animate-pulse rounded" />;
  }

  // 7. Number/Count columns - price, count, etc.
  if (
    headerText.includes("price") ||
    headerText.includes("count") ||
    headerText.includes("amount") ||
    headerText.includes("quantity") ||
    columnId.includes("price") ||
    columnId.includes("count")
  ) {
    return <Skeleton className="bg-muted/60 h-4 w-16 animate-pulse rounded" />;
  }

  // 8. Description/Content columns - longer text
  if (
    headerText.includes("description") ||
    headerText.includes("content") ||
    headerText.includes("message") ||
    columnId.includes("description") ||
    columnId.includes("content")
  ) {
    return (
      <div className="space-y-2">
        <Skeleton className="bg-muted/60 h-4 w-full animate-pulse rounded" />
        <Skeleton className="bg-muted/60 h-4 w-3/4 animate-pulse rounded" />
        <Skeleton className="bg-muted/40 h-4 w-1/2 animate-pulse rounded" />
      </div>
    );
  }

  // 9. Avatar/Image columns
  if (
    headerText.includes("avatar") ||
    headerText.includes("image") ||
    headerText.includes("photo") ||
    columnId.includes("avatar") ||
    columnId.includes("image")
  ) {
    return (
      <div className="flex items-center space-x-3">
        <Skeleton className="bg-muted/60 h-8 w-8 animate-pulse rounded-full" />
        <Skeleton
          className={`bg-muted/60 ${variation.width} ${variation.height} animate-pulse rounded`}
        />
      </div>
    );
  }

  // 10. Boolean/Checkbox columns
  if (
    headerText.includes("active") ||
    headerText.includes("enabled") ||
    headerText.includes("verified") ||
    columnId.includes("active") ||
    columnId.includes("enabled")
  ) {
    return <Skeleton className="bg-muted/60 h-4 w-4 animate-pulse rounded" />;
  }

  // Default skeleton for unknown column types
  return (
    <Skeleton
      className={`bg-muted/60 ${variation.width} ${variation.height} animate-pulse rounded`}
    />
  );
}
