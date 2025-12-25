import { type Table } from "@tanstack/react-table";
import { ChevronDown, Columns3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableViewOptionsProperties<TData> {
  table?: Table<TData>;
  isLoading?: boolean;
}

export default function TableViewOptions<TData>({
  table,
  isLoading = false,
}: TableViewOptionsProperties<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="hover:text-foreground! ml-auto hidden h-10 font-medium hover:bg-gray-100! lg:flex"
          aria-label="Open column visibility options"
        >
          <Columns3 className="mr-2 h-4 w-4" />
          <span className="hidden sm:block">Columns</span>
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {table &&
          table
            .getAllColumns()
            .filter((column) => column.accessorFn !== undefined && column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="hover:bg-accent/10! hover:text-accent! focus:bg-accent/20! focus:text-accent! font-medium capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
