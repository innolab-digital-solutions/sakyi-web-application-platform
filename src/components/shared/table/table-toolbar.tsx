"use client";

import { Table } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { TableSearchConfig } from "@/types/shared/table";

import TableViewOptions from "./table-view-options";

interface TableToolbarProperties<TData> {
  table: Table<TData> | undefined;
  search: TableSearchConfig;
  showColumnVisibility?: boolean;
  toolbarActions?: React.ReactNode;
  isLoading?: boolean;
}

export default function TableToolbar<TData>({
  table,
  search,
  showColumnVisibility = true,
  toolbarActions,
  isLoading = false,
}: TableToolbarProperties<TData>) {
  const handleSearch = (value: string) => {
    if (search.onChange) {
      search.onChange(value);
    } else if (table) {
      table.setGlobalFilter(value);
    }
  };

  const searchValue = search.value ?? (table ? table.getState().globalFilter : "") ?? "";

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full sm:w-80">
          <Input
            type="search"
            placeholder={search.placeholder}
            value={searchValue}
            onChange={(event) => handleSearch(event.target.value)}
            className="h-10 w-full font-medium"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute top-1/2 right-2 -translate-y-1/2">
              <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {toolbarActions && <div className="flex items-center space-x-2">{toolbarActions}</div>}
        {showColumnVisibility && table && <TableViewOptions table={table} />}
      </div>
    </div>
  );
}
