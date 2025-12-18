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
import {
  TablePaginationConfig,
  TableSearchConfig,
  TableSkeletonConfig,
  TableUIConfig,
} from "@/types/shared/table";

import TableToolbar from "./table-toolbar";

/**
 * Props interface for the TableLoading component
 *
 * @template TData - The type of data in each row
 * @template TValue - The type of values in the cells
 */
interface TableLoadingProperties<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  searchConfig: Required<TableSearchConfig>;
  uiConfig: Required<TableUIConfig>;
  paginationConfig?: Required<TablePaginationConfig>;
  skeletonConfig?: Required<TableSkeletonConfig>;
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
  skeletonConfig,
}: TableLoadingProperties<TData, TValue>) {
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
            <TableRow className="hover:bg-transparent!">
              {columns.map((column, index) => (
                <TableHead
                  key={column.id || index}
                  className="text-xs font-semibold tracking-wide text-gray-600 uppercase!"
                >
                  <div className="px-3.5 py-1.5">
                    {typeof column.header === "string" ? column.header : "Loading..."}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Dynamic skeleton rows based on page size, with optional override */}
            {Array.from({
              length: paginationConfig?.pageSize || skeletonConfig?.rows || 6,
            }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-muted/40 transition-colors">
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="px-3.5 py-1.5">
                      <SkeletonRowContent
                        column={column}
                        rowIndex={rowIndex}
                        customSkeletons={skeletonConfig?.customSkeletons}
                      />
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
  customSkeletons,
}: {
  column: ColumnDef<TData, TValue>;
  rowIndex: number;
  customSkeletons?: Record<string, React.ReactNode>;
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
  const columnId = column.id?.toLowerCase() || "";
  const accessorKey =
    (column as unknown as { accessorKey: string }).accessorKey?.toString().toLowerCase() || "";

  // Check for custom skeleton first
  if (customSkeletons && customSkeletons[columnId]) {
    return <>{customSkeletons[columnId]}</>;
  }

  if (customSkeletons && customSkeletons[accessorKey]) {
    return <>{customSkeletons[accessorKey]}</>;
  }

  // Actions column - buttons and dropdowns
  if (columnId.includes("action")) {
    return (
      <div className="flex items-center space-x-1">
        <Skeleton className="bg-muted/60 h-8 w-8 animate-pulse rounded" />
        <Skeleton className="bg-muted/60 h-8 w-8 animate-pulse rounded" />
      </div>
    );
  }

  // Default skeleton for unknown column types
  return (
    <Skeleton
      className={`bg-muted/60 ${variation.width} ${variation.height} animate-pulse rounded`}
    />
  );
}
