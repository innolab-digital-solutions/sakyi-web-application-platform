"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
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
      return <div className="text-sm font-medium text-neutral-800">{abbreviation}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const unit = row.original;

      const editAllowed = Boolean(unit.actions?.edit?.allowed);
      const editReasons = unit.actions?.edit?.reasons ?? [];
      const editDisabledReason =
        editAllowed || editReasons.length === 0 ? undefined : editReasons[0]?.trim() || undefined;

      return (
        <div className="flex items-center space-x-0.5">
          <UnitForm
            mode="edit"
            defaultValues={unit}
            trigger={(() => {
              return (
                <DisabledTooltip reason={editDisabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10 hover:text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
                    disabled={!editAllowed}
                    aria-label="Edit unit"
                  >
                    <SquarePen className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                </DisabledTooltip>
              );
            })()}
          />

          <UnitDeletionDialog unit={unit} />
        </div>
      );
    },
  },
];
