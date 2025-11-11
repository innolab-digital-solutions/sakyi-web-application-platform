"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Archive, CalendarDays, CheckCircle, FileEdit, SquarePen } from "lucide-react";
import Link from "next/link";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import { BlogPost } from "@/types/admin/blog-post";
import { cn } from "@/utils/shared/cn";

import { ImagePreview } from "../../shared/image-preview";
import BlogPostDeletionDialog from "./blog-post-deletion-dialog";

const statusMeta = {
  draft: {
    variant: "secondary" as const,
    icon: FileEdit,
    label: "Draft",
    badgeClass: "bg-yellow-100 text-yellow-700",
    iconClass: "text-yellow-700 h-3.5 w-3.5",
  },
  published: {
    variant: "secondary" as const,
    icon: CheckCircle,
    label: "Published",
    badgeClass: "bg-green-100 text-green-700",
    iconClass: "text-green-700 h-3.5 w-3.5",
  },
  archived: {
    variant: "secondary" as const,
    icon: Archive,
    label: "Archived",
    badgeClass: "bg-slate-100 text-slate-700",
    iconClass: "text-slate-700 h-3.5 w-3.5",
  },
};

export const blogPostsTableColumns: ColumnDef<BlogPost>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column}>Post</SortableHeader>,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const blogPost = row.original;
      const description = blogPost.description || "-";
      const thumbnailUrl = blogPost.thumbnail;
      const status = blogPost.status || "draft";
      const meta = statusMeta[status] || statusMeta.draft;

      return (
        <div className="flex min-w-0 items-start gap-4">
          <div className="bg-muted/50 ring-muted-foreground/5 relative size-12 shrink-0 overflow-hidden rounded-md ring-1">
            {thumbnailUrl ? (
              <ImagePreview src={thumbnailUrl} alt={title} type="Thumbnail" />
            ) : (
              <div className="text-muted-foreground/50 flex h-full w-full items-center justify-center text-xs font-medium">
                N/A
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-foreground text-sm font-semibold">{title}</span>
              <Badge
                variant={meta.variant}
                className={cn(
                  meta.badgeClass,
                  "pointer-events-none flex items-center gap-1 font-semibold",
                )}
              >
                <meta.icon className={meta.iconClass} />
                <span>{meta.label}</span>
              </Badge>
            </div>
            <div className="text-muted-foreground max-w-full break-words whitespace-pre-line">
              {description}
            </div>
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
      return <div className="text-sm font-medium text-gray-700">{categoryName}</div>;
    },
  },
  {
    accessorKey: "published_at",
    header: ({ column }) => <SortableHeader column={column}>Published</SortableHeader>,
    cell: ({ row }) => {
      const publishedAt = row.getValue("published_at") as string | null;
      if (!publishedAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground border-dashed !font-semibold"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="ml-1">Not published</span>
          </Badge>
        );
      }

      const formatted = dayjs(publishedAt).isValid()
        ? dayjs(publishedAt).format("DD-MMMM-YYYY")
        : publishedAt;

      return <div className="text-sm font-medium text-gray-700">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const blogPost = row.original;

      return (
        <div className="flex items-center space-x-0.5">
          <DisabledTooltip
            reason={
              blogPost.actions?.editable
                ? undefined
                : "You don't have permission to edit this post."
            }
          >
            <Button
              variant="ghost"
              size="sm"
              asChild
              disabled={!Boolean(blogPost.actions?.editable)}
            >
              <Link
                href={PATHS.ADMIN.BLOG_POSTS.EDIT(blogPost.id)}
                className="hover:bg-accent/10 hover:text-accent text-accent flex cursor-pointer items-center justify-center text-sm font-semibold disabled:hover:!bg-transparent disabled:hover:!text-inherit"
              >
                <SquarePen className="h-2 w-2" />
                <span>Edit</span>
              </Link>
            </Button>
          </DisabledTooltip>

          <BlogPostDeletionDialog blogPost={blogPost} />
        </div>
      );
    },
  },
];
