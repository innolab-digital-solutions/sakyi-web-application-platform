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
    accessorKey: "calories_per_unit",
    header: () => "Nutrition",
    cell: ({ row }) => {
      const foodItem = row.original;
      const calories = foodItem.calories_per_unit ?? 0;
      const unitName = foodItem.unit?.name || "—";

      if (unitName === "—") {
        return <div className="text-sm font-medium text-neutral-800">—</div>;
      }

      return (
        <div className="flex flex-col gap-0.5">
          <div className="text-sm font-semibold text-neutral-900">{calories} kcal</div>
          <div className="text-xs text-neutral-500">per {unitName}</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const foodItem = row.original;

      const editAllowed = Boolean(foodItem.actions?.edit?.allowed);
      const editReasons = foodItem.actions?.edit?.reasons ?? [];
      const editDisabledReason =
        editAllowed || editReasons.length === 0 ? undefined : editReasons[0]?.trim() || undefined;

      return (
        <div className="flex items-center space-x-0.5">
          <FoodItemForm
            mode="edit"
            defaultValues={foodItem}
            trigger={(() => {
              return (
                <DisabledTooltip reason={editDisabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10 hover:text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
                    disabled={!editAllowed}
                    aria-label="Edit food item"
                  >
                    <SquarePen className="h-4 w-4" />
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
