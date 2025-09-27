"use client";

import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { TableSearchConfig } from "@/types/shared/table";

import TableViewOptions from "./table-view-options";

interface TableToolbarProperties<TData> {
  table: Table<TData>;
  search: TableSearchConfig;
  showColumnVisibility?: boolean;
  toolbarActions?: React.ReactNode;
}

export default function TableToolbar<TData>({
  table,
  search,
  showColumnVisibility = true,
  toolbarActions,
}: TableToolbarProperties<TData>) {
  const handleSearch = (value: string) => {
    if (search.onChange) {
      search.onChange(value);
    } else {
      table.setGlobalFilter(value);
    }
  };

  const searchValue = search.value ?? table.getState().globalFilter ?? "";

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          type="search"
          placeholder={search.placeholder}
          value={searchValue}
          onChange={(event) => handleSearch(event.target.value)}
          className="h-10 max-w-xs font-medium"
        />
      </div>

      <div className="flex items-center space-x-2">
        {toolbarActions && <div className="flex items-center space-x-2">{toolbarActions}</div>}
        {showColumnVisibility && <TableViewOptions table={table} />}
      </div>
    </div>
  );
}
