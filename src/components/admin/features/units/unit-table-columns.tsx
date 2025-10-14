"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import React from "react";

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
      return <div className="text-foreground text-sm font-semibold">{name}</div>;
    },
  },
  {
    accessorKey: "abbreviation",
    header: ({ column }) => <SortableHeader column={column}>Abbreviation</SortableHeader>,
    cell: ({ row }) => {
      const abbreviation = row.getValue("abbreviation") as string;
      return <div className="text-foreground font-medium">{abbreviation}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const unit = row.original;

      return (
        <div className="flex items-center space-x-0.5">
          <UnitForm
            mode="edit"
            defaultValues={unit}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-accent/10 hover:text-accent text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
              >
                <SquarePen className="h-2 w-2" />
                <span>Edit</span>
              </Button>
            }
          />

          <UnitDeletionDialog unit={unit} />
        </div>
      );
    },
  },
];
