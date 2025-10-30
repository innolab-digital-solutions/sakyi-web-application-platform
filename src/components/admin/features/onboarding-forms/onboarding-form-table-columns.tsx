"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CalendarDays, SquarePen, Tag } from "lucide-react";
import Link from "next/link";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import { OnboardingForm } from "@/types/admin/onboarding-form";

export const onboardingFormsTableColumns: ColumnDef<OnboardingForm>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column}>Form</SortableHeader>,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const description = row.original.description || "-";
      const status = (row.original.status || "").toLowerCase();
      const isPublished = Boolean(row.original.published_at);

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-semibold">{title}</span>
            <Badge
              variant={isPublished || status === "published" ? "secondary" : "outline"}
              className={
                isPublished || status === "published"
                  ? "bg-primary/10 text-primary !font-semibold"
                  : "bg-muted/60 text-muted-foreground border-dashed !font-semibold"
              }
            >
              <Tag className="h-3.5 w-3.5" />
              <span className="ml-1 capitalize">
                {status || (isPublished ? "published" : "draft")}
              </span>
            </Badge>
          </div>
          <div className="text-muted-foreground max-w-full break-words whitespace-pre-line">
            {description}
          </div>
        </div>
      );
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

      return <div className="text-foreground text-sm font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const form = row.original;

      return (
        <div className="flex items-center space-x-0.5">
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-accent/10 hover:text-accent text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
            asChild
          >
            <Link href={PATHS.ADMIN.ONBOARDING_FORMS.EDIT(form.id)}>
              <SquarePen className="h-2 w-2" />
              <span>Edit</span>
            </Link>
          </Button>

          <DisabledTooltip
            reason={
              form.actions?.editable ? undefined : "You don't have permission to edit this form."
            }
          >
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-accent/10 hover:text-accent text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
              disabled={!form.actions?.editable}
              aria-label="Edit onboarding form"
            >
              <SquarePen className="h-2 w-2" />
              <span>Edit</span>
            </Button>
          </DisabledTooltip>

          <DisabledTooltip
            reason={
              form.actions?.deletable ? undefined : "You don't have permission to delete this form."
            }
          >
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-destructive/10 hover:text-destructive flex cursor-pointer items-center justify-center text-sm font-semibold"
              disabled={!form.actions?.deletable}
              aria-label="Delete onboarding form"
            >
              <span>Delete</span>
            </Button>
          </DisabledTooltip>
        </div>
      );
    },
  },
];
