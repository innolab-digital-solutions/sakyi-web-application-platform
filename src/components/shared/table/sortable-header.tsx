"use client";

import { Column } from "@tanstack/react-table";
import { MoveDown, MoveUp } from "lucide-react";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/utils/shared/cn";

interface SortableHeaderProperties<TData, TValue> {
  column: Column<TData, TValue>;
  children: React.ReactNode;
  className?: string;
}

export default function SortableHeader<TData, TValue>({
  column,
  children,
  className,
}: SortableHeaderProperties<TData, TValue>) {
  const handleClick = useCallback(() => {
    const currentSort = column.getIsSorted();

    // Cycle through: none -> asc -> desc -> none
    if (currentSort === false) {
      // First click: sort ascending
      column.toggleSorting(false);
    } else if (currentSort === "asc") {
      // Second click: sort descending
      column.toggleSorting(true);
    } else {
      // Third click: reset (clear sorting)
      column.clearSorting();
    }
  }, [column]);

  if (!column.getCanSort()) {
    return <div className={cn("px-2", className)}>{children}</div>;
  }

  const isSorted = column.getIsSorted();
  const canReset = isSorted !== false;

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={cn(
        "flex cursor-pointer items-center justify-center gap-x-1! border-none bg-transparent px-0! py-2! text-xs font-bold tracking-wide text-gray-600 uppercase! hover:bg-transparent hover:text-gray-500",
        className,
      )}
      title={
        canReset
          ? "Click to sort ascending, click again for descending, click again to reset"
          : "Click to sort ascending"
      }
    >
      <div>{children}</div>

      <div className="flex items-center justify-center -space-x-2">
        <MoveUp
          className={cn(
            String(isSorted) === "asc" ? "text-primary" : "text-gray-400",
            "h-3.5! w-3.5!",
          )}
        />
        <MoveDown
          className={cn(
            String(isSorted) === "desc" ? "text-primary" : "text-gray-400",
            "h-3.5! w-3.5!",
          )}
        />
      </div>
    </Button>
  );
}
