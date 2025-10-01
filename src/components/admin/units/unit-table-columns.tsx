"use client";

import { ColumnDef } from "@tanstack/react-table";

import SortableHeader from "@/components/shared/table/sortable-header";
import { Unit } from "@/types/admin/unit";

export const unitsTableColumns: ColumnDef<Unit>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="text-foreground text-sm font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "abbreviation",
    header: ({ column }) => <SortableHeader column={column}>Abbreviation</SortableHeader>,
    cell: ({ row }) => {
      const abbreviation = row.getValue("abbreviation") as string;
      return <div className="text-muted-foreground text-sm">{abbreviation}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const unit = row.original;

      return <div className="flex items-center space-x-2"></div>;
    },
  },
];
