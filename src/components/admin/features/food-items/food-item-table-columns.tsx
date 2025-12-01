"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Button } from "@/components/ui/button";
import { FoodItem } from "@/types/admin/food-item";

import FoodItemDeletionDialog from "./food-item-deletion-dialog";
import FoodItemForm from "./food-item-form";
export const foodItemsTableColumns: ColumnDef<FoodItem>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const description = row.original.description || "-";

      return (
        <div>
          <div className="text-foreground text-sm font-semibold">{name}</div>
          <div className="text-muted-foreground line-clamp-2 max-w-full wrap-break-word whitespace-pre-line">
            {description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => {
      const categoryName = row.original.category?.name || "—";
      return <div className="text-sm font-medium text-neutral-800">{categoryName}</div>;
    },
  },
  {
    accessorKey: "unit.name",
    header: "Unit",
    cell: ({ row }) => {
      const unitName = row.original.unit?.name || "—";
      return <div className="text-sm font-medium text-neutral-800">{unitName}</div>;
    },
  },
  {
    accessorKey: "calories_per_unit",
    header: "Calories / Unit",
    cell: ({ row }) => {
      const calories = row.getValue("calories_per_unit") as number;
      return <div className="text-sm font-medium text-neutral-800">{calories}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const foodItem = row.original;

      return (
        <div className="flex items-center space-x-0.5">
          <FoodItemForm
            mode="edit"
            defaultValues={foodItem}
            trigger={(() => {
              const isEditable = Boolean(foodItem.actions?.editable);
              const disabledReason = isEditable
                ? undefined
                : "You don't have permission to edit this item.";
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

          <FoodItemDeletionDialog foodItem={foodItem} />
        </div>
      );
    },
  },
];
