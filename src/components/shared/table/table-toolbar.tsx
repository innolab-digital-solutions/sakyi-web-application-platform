"use client";

import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";

import TableViewOptions from "./table-view-options";

interface TableToolbarProperties<TData> {
  table: Table<TData>;
  searchKeys?: string[];
  searchPlaceholder?: string;
  showColumnVisibility?: boolean;
  toolbarActions?: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}

export default function TableToolbar<TData>({
  table,
  searchKeys,
  searchPlaceholder = "Search...",
  showColumnVisibility = true,
  toolbarActions,
  value,
  onChange,
}: TableToolbarProperties<TData>) {
  const handleGlobalSearch = (value: string) => {
    if (onChange) {
      onChange(value);
    } else {
      table.setGlobalFilter(value);
    }
  };

  const globalFilterValue = value ?? table.getState().globalFilter ?? "";
  return (
    <div className="flex w-full items-center justify-between">
      {searchKeys && searchKeys.length > 0 && (
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={searchPlaceholder}
            value={globalFilterValue}
            onChange={(event) => handleGlobalSearch(event.target.value)}
            className="h-10 max-w-xs font-medium"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        {/* Custom toolbar actions */}
        {toolbarActions && <div className="flex items-center space-x-2">{toolbarActions}</div>}

        {/* Column visibility toggle */}
        {showColumnVisibility && <TableViewOptions table={table} />}
      </div>
    </div>
  );
}
