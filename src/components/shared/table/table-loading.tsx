"use client";

import { type ColumnDef } from "@tanstack/react-table";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePaginationConfig, TableSearchConfig, TableUIConfig } from "@/types/shared/table";

import TableToolbar from "./table-toolbar";

/**
 * Props interface for the TableLoading component
 *
 * @template TData - The type of data in each row
 * @template TValue - The type of values in the cells
 */
interface TableLoadingProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  searchConfig: Required<TableSearchConfig>;
  uiConfig: Required<TableUIConfig>;
  paginationConfig?: Required<TablePaginationConfig>;
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
export default function TableLoading<TData, TValue>({
  columns,
  searchConfig,
  uiConfig,
  paginationConfig,
}: TableLoadingProps<TData, TValue>) {
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
