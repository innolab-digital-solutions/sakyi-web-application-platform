import { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
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
          <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            <Search size={16} />
          </span>
          <Input
            type="search"
            placeholder={search.placeholder}
            value={searchValue}
            onChange={(event) => handleSearch(event.target.value)}
            className="h-10 w-full pl-9 font-medium"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute top-1/2 right-2 -translate-y-1/2">
              <Spinner className="text-muted-foreground" />
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
