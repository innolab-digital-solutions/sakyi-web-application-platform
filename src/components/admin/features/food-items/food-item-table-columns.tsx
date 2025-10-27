"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import React from "react";

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
      return <div className="text-foreground text-sm font-semibold">{name}</div>;
    },
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => {
      const categoryName = row.original.category?.name || "—";
      return <div className="text-muted-foreground text-sm">{categoryName}</div>;
    },
  },
  {
    accessorKey: "unit.name",
    header: "Unit",
    cell: ({ row }) => {
      const unitName = row.original.unit?.name || "—";
      return <div className="text-muted-foreground text-sm">{unitName}</div>;
    },
  },
  {
    accessorKey: "calories_per_unit",
    header: "Calories / Unit",
    cell: ({ row }) => {
      const calories = row.getValue("calories_per_unit") as number;
      return <div className="text-muted-foreground text-sm">{calories}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <div className="text-muted-foreground line-clamp-2 max-w-xs text-sm">
          {description || "—"}
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

      return (
        <div className="flex items-center space-x-0.5">
          <FoodItemForm
            mode="edit"
            defaultValues={foodItem}
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

          <FoodItemDeletionDialog foodItem={foodItem} />
        </div>
      );
    },
  },
];
