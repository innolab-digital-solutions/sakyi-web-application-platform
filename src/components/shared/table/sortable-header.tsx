"use client";

import { Column } from "@tanstack/react-table";
import { MoveDown, MoveUp } from "lucide-react";
import { useCallback, useRef } from "react";

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
  const clickCountReference = useRef(0);
  const clickTimeoutReference = useRef<NodeJS.Timeout>(null);

  const handleClick = useCallback(() => {
    // Clear any existing timeout
    if (clickTimeoutReference.current) {
      clearTimeout(clickTimeoutReference.current);
    }

    clickCountReference.current += 1;

    // If this is the third click, reset sorting
    if (clickCountReference.current === 3) {
      column.clearSorting();
      clickCountReference.current = 0;
      return;
    }

    // Normal sorting behavior for first two clicks
    column.toggleSorting(column.getIsSorted() === "asc");

    // Reset click count after a delay
    clickTimeoutReference.current = setTimeout(() => {
      clickCountReference.current = 0;
    }, 500);
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
          ? "Click to sort ascending, click again for descending, triple-click to reset"
          : "Click to sort"
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
