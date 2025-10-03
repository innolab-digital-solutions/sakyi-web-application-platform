"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CornerDownRight, Network, SquarePen, Trash } from "lucide-react";
import React from "react";

import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WorkoutCategory } from "@/types/admin/workout-category";

export const workoutCategoryTableColumns: ColumnDef<WorkoutCategory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Category</SortableHeader>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const description = row.original.description || "-";
      const parent = row.original.parent;

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-semibold">{name}</span>
            {parent ? (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary flex items-center gap-1 !font-semibold"
              >
                <CornerDownRight className="text-primary h-3.5 w-3.5" />
                Parent: {parent.name}
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="text-muted-foreground bg-muted/60 flex items-center gap-1 border-dashed !font-semibold"
              >
                <Network className="text-muted-foreground h-3.5 w-3.5" />
                Root
              </Badge>
            )}
          </div>
          <div className="text-muted-foreground">{description}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: () => {
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="default"
            size="sm"
            className="!bg-primary hover:!bg-primary/90 flex cursor-pointer items-center gap-1.5 text-[13px] font-medium"
          >
            <SquarePen className="h-2 w-2" />
            <span>Edit</span>
          </Button>

          <Button
            variant="destructive"
            size="sm"
            className={`flex cursor-pointer items-center gap-1.5 text-[13px] font-medium`}
          >
            <Trash className="h-2 w-2" />
            <span>Delete</span>
          </Button>
        </div>
      );
    },
  },
];
