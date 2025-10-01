"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";

import SortableHeader from "@/components/shared/table/sortable-header";
import { Button } from "@/components/ui/button";
import { Unit } from "@/types/admin/unit";

import UnitDeletionDialog from "./unit-deletion-dialog";
import UnitForm from "./unit-form";

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

      return (
        <div className="flex items-center space-x-2">
          <UnitForm
            mode="edit"
            defaultValues={unit}
            trigger={
              <Button
                variant="default"
                size="sm"
                className="!bg-primary hover:!bg-primary/90 flex cursor-pointer items-center gap-1.5 text-[13px] font-medium"
              >
                <SquarePen className="h-2 w-2" />
                <span>Edit</span>
              </Button>
            }
          />

          {/* Delete Unit Button */}
          <UnitDeletionDialog unit={unit} />
        </div>
      );
    },
  },
];
