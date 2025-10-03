"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";

import FoodCategoryDeletionDialog from "@/components/admin/foodcategories/category-deletion-dialog";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FoodCategory } from "@/types/admin/food-category";

import FoodCategoryForm from "./category-form";

export const foodCategoriesTableColumns: ColumnDef<FoodCategory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Category</SortableHeader>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const description = row.original.description || "-";

      return (
        <div>
          <div className="text-foreground text-sm font-semibold">{name}</div>
          <div className="text-muted-foreground">{description}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "parent",
    header: "Parent Category",
    cell: ({ row }) => {
      const parent = row.original.parent;
      return (
        <Badge variant={parent ? "secondary" : "outline"}>
          {parent ? parent.name : "Main Category"}
        </Badge>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex items-center space-x-2">
          {/* Edit Category */}
          <FoodCategoryForm
            mode="edit"
            defaultValues={{
              ...category,
              description: category.description || undefined,
            }}
            trigger={
              <Button
                variant="default"
                size="sm"
                className="!bg-primary hover:!bg-primary/90 flex cursor-pointer items-center gap-1.5 text-[13px] font-medium"
              >
                <SquarePen className="h-3 w-3" />
                <span>Edit</span>
              </Button>
            }
          />

          {/* Delete Category */}
          <FoodCategoryDeletionDialog category={category} />
        </div>
      );
    },
  },
];
