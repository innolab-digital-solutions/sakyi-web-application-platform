import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableToolbar } from "./table-toolbar";
import { Pagination } from "./pagination";
import { EmptyState } from "./empty-state";

type EmptyStateProps = React.ComponentProps<typeof EmptyState>;

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  showColumnVisibility?: boolean;
  showFilters?: boolean;
  showToolbar?: boolean;
  showPagination?: boolean;
  emptyStateProps?: EmptyStateProps;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumn,
  searchPlaceholder = "Search...",
  showColumnVisibility = true,
  showFilters = true,
  showToolbar = true,
  showPagination = true,
  emptyStateProps,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full border border-border rounded-md">
      {showToolbar && (
        <TableToolbar
          table={table}
          searchColumn={searchColumn}
          searchPlaceholder={searchPlaceholder}
          showColumnVisibility={showColumnVisibility}
          showFilters={showFilters}
        />
      )}

      <div className="overflow-hidden border-border border-x-0">
        <Table>
          <TableHeader className="border-y border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-100 hover:!bg-gray-100"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <EmptyState
                colSpan={columns.length}
                showSearchTip={
                  table.getState().columnFilters.length > 0 ||
                  table.getState().globalFilter
                }
                {...emptyStateProps}
              />
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && <Pagination />}
    </div>
  );
}
