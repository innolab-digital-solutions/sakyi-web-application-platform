"use client";

import { Column } from "@tanstack/react-table";
import { MoveDown, MoveUp } from "lucide-react";

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
  if (!column.getCanSort()) {
    return <div className={cn("px-2", className)}>{children}</div>;
  }

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className={cn(
        "flex cursor-pointer items-center justify-center !gap-x-1 border-none bg-transparent !px-0 !py-2 text-xs font-semibold tracking-wide text-gray-600 !uppercase hover:bg-transparent hover:text-gray-500",
        className,
      )}
    >
      <div>{children}</div>

      <div className="flex items-center justify-center -space-x-2">
        <MoveUp
          className={cn(
            column.getIsSorted() === "asc" ? "text-primary" : "text-gray-400",
            "!h-3.5 !w-3.5",
          )}
        />
        <MoveDown
          className={cn(
            column.getIsSorted() === "desc" ? "text-primary" : "text-gray-400",
            "!h-3.5 !w-3.5",
          )}
        />
      </div>
    </Button>
  );
}
