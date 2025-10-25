"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CornerDownRight, Network, SquarePen } from "lucide-react";
import React from "react";

import WorkoutCategoryDeletionDialog from "@/components/admin/features/workout-categories/workout-category-deletion-dialog";
import WorkoutCategoryForm from "@/components/admin/features/workout-categories/workout-category-form";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
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
          <div className="text-muted-foreground max-w-full break-words whitespace-pre-line">
            {description}
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const workoutCategory = row.original;

      return (
        <div className="flex items-center space-x-0.5">
          <WorkoutCategoryForm
            mode="edit"
            defaultValues={workoutCategory}
            trigger={(() => {
              const isEditable = Boolean(workoutCategory.actions?.editable);
              const disabledReason = isEditable
                ? undefined
                : "You don't have permission to edit this category.";
              return (
                <DisabledTooltip reason={disabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-accent/10 hover:text-accent text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
                    disabled={!isEditable}
                  >
                    <SquarePen className="h-2 w-2" />
                    <span>Edit</span>
                  </Button>
                </DisabledTooltip>
              );
            })()}
          />

          <WorkoutCategoryDeletionDialog workoutCategory={workoutCategory} />
        </div>
      );
    },
  },
];
