"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import React from "react";

import SortableHeader from "@/components/shared/table/sortable-header";
import { Button } from "@/components/ui/button";
import { BlogCategory } from "@/types/admin/blog-category";

import BlogCategoryDeletionDialog from "./blog-category-deletion-dialog";
import BlogCategoryForm from "./blog-category-form";

export const blogCategoriesTableColumns: ColumnDef<BlogCategory>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Category</SortableHeader>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <div className="text-foreground text-sm font-semibold">{name}</div>;
    },
  },
  {
    accessorKey: "slug",
    header: ({ column }) => <SortableHeader column={column}>Slug</SortableHeader>,
    cell: ({ row }) => {
      const slug = row.getValue("slug") as string;
      return <div className="text-muted-foreground text-sm">{slug}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const blogCategory = row.original;

      return (
        <div className="flex items-center space-x-0.5">
          <BlogCategoryForm
            mode="edit"
            defaultValues={blogCategory}
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

          <BlogCategoryDeletionDialog blogCategory={blogCategory} />
        </div>
      );
    },
  },
];
