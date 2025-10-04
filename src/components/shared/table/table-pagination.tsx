"use client";

import { Table } from "@tanstack/react-table";
import { useMemo } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/shared/cn";

interface TablePaginationProperties<TData> {
  table: Table<TData>;
  totalItems?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Add server-side state props
  currentPage?: number;
  pageCount?: number;
  pageSize?: number;
}

export default function TablePagination<TData>({
  table,
  totalItems,
  onPageChange,
  onPageSizeChange,
  currentPage,
  pageCount: serverPageCount,
  pageSize: serverPageSize,
}: TablePaginationProperties<TData>) {
  // Use server state when available, fallback to table state
  const actualCurrentPage =
    currentPage === undefined
      ? table.getState().pagination.pageIndex + 1 // Convert 0-based to 1-based
      : currentPage + 1;

  const actualPageCount = serverPageCount ?? table.getPageCount();
  const actualPageSize = serverPageSize ?? table.getState().pagination.pageSize;

  const pageItems = useMemo(() => {
    const total = actualPageCount;
    const current = actualCurrentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const items: Array<number | "ellipsis"> = [];
    const showRange = (start: number, end: number) => {
      for (let index = start; index <= end; index += 1) items.push(index);
    };

    items.push(1);
    if (current > 4) items.push("ellipsis");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    showRange(start, end);

    if (current < total - 3) items.push("ellipsis");
    if (total > 1) items.push(total);

    return items;
  }, [actualCurrentPage, actualPageCount]);

  const canPreviousPage = actualCurrentPage > 1;
  const canNextPage = actualCurrentPage < actualPageCount;

  return (
    <div className="flex w-full items-center justify-between space-x-6 py-3 lg:space-x-8">
      <div className="flex items-center space-x-2">
        <Select
          value={String(actualPageSize)}
          onValueChange={(value) => {
            const size = Number(value);
            if (onPageSizeChange) {
              onPageSizeChange(size);
            } else {
              table.setPageSize(size);
            }
          }}
        >
          <SelectTrigger className="h-8 w-[70px] cursor-pointer hover:bg-gray-100">
            <SelectValue placeholder={String(actualPageSize)} />
          </SelectTrigger>
          <SelectContent side="top" className="!min-w-[2rem]">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem
                key={pageSize}
                value={String(pageSize)}
                className="hover:!bg-accent/10 hover:!text-accent focus:!bg-accent/20 focus:!text-accent font-medium"
              >
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm font-medium">Rows per page</p>
      </div>

      {/* Show total items if available */}
      {totalItems && (
        <div className="text-muted-foreground text-sm font-medium">
          Showing {(actualCurrentPage - 1) * actualPageSize + 1} to{" "}
          {Math.min(actualCurrentPage * actualPageSize, totalItems)} of {totalItems} results
        </div>
      )}

      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (onPageChange) {
                    onPageChange(actualCurrentPage - 2); // Convert back to 0-based
                  } else {
                    table.previousPage();
                  }
                }}
                aria-disabled={!canPreviousPage}
                className={cn(
                  "font-semibold",
                  canPreviousPage
                    ? "cursor-pointer hover:bg-gray-100 hover:text-gray-800"
                    : "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>

            {pageItems.map((item, index) => (
              <PaginationItem key={`${item}-${index}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    className={
                      actualCurrentPage === item
                        ? "bg-accent text-accent-foreground hover:bg-accent/90"
                        : "bg-background border-border border hover:bg-gray-100 hover:text-gray-700"
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      if (onPageChange) {
                        onPageChange(item - 1); // Convert to 0-based
                      } else {
                        table.setPageIndex(item - 1);
                      }
                    }}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (onPageChange) {
                    onPageChange(actualCurrentPage); // Convert to 0-based (current + 1 - 1)
                  } else {
                    table.nextPage();
                  }
                }}
                aria-disabled={!canNextPage}
                className={cn(
                  "font-semibold",
                  canNextPage
                    ? "cursor-pointer hover:bg-gray-100 hover:text-gray-800"
                    : "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
