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

interface TablePaginationProperties<TData> {
  table: Table<TData>;
  totalItems?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export default function TablePagination<TData>({
  table,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProperties<TData>) {
  const pageItems = useMemo(() => {
    const total = table.getPageCount();
    const current = table.getState().pagination.pageIndex + 1;

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
    items.push(total);

    return items;
  }, [table]);

  return (
    <div className="flex w-full items-center justify-between space-x-6 lg:space-x-8">
      <div className="flex items-center space-x-2">
        <Select
          value={String(table.getState().pagination.pageSize)}
          onValueChange={(value) => {
            const size = Number(value);
            if (onPageSizeChange) onPageSizeChange(size);
            else table.setPageSize(size);
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <SelectItem key={pageSize} value={String(pageSize)}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm font-medium">Rows per page</p>
      </div>

      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (onPageChange) onPageChange(table.getState().pagination.pageIndex - 1);
                  else table.previousPage();
                }}
                aria-disabled={!table.getCanPreviousPage()}
                className={table.getCanPreviousPage() ? "" : "pointer-events-none opacity-50"}
              />
            </PaginationItem>

            {pageItems.map((item, index) => (
              <PaginationItem key={`${item}-${index}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={table.getState().pagination.pageIndex + 1 === item}
                    onClick={(event) => {
                      event.preventDefault();
                      if (onPageChange) onPageChange(item - 1);
                      else table.setPageIndex(item - 1);
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
                  if (onPageChange) onPageChange(table.getState().pagination.pageIndex + 1);
                  else table.nextPage();
                }}
                aria-disabled={!table.getCanNextPage()}
                className={table.getCanNextPage() ? "" : "pointer-events-none opacity-50"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
