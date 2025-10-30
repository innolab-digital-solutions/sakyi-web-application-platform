"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CalendarDays, Ellipsis, SquarePen, Tag } from "lucide-react";
import Link from "next/link";
import React from "react";

import OnboardingFormDeletionDialog from "@/components/admin/features/onboarding-forms/onboarding-form-deletion-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open actions"
              className="hover:!text-foreground ml-auto size-8 cursor-pointer items-center justify-center hover:!bg-gray-100"
            >
              <Ellipsis className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="p-3.5">
            <DropdownMenuLabel className="text-muted-foreground text-[13px] font-semibold">
              Onboarding Form Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DisabledTooltip
                reason={
                  form.actions?.editable
                    ? undefined
                    : "You don't have permission to edit this onboarding form."
                }
              >
                <Button
                  variant="outline"
                  className="hover:!bg-accent/10 group hover:!text-accent hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !rounded-md !border-none text-sm font-medium text-gray-700 shadow-none disabled:hover:!bg-transparent disabled:hover:!text-inherit"
                  disabled={!Boolean(form.actions?.editable)}
                >
                  <Link
                    href={PATHS.ADMIN.ONBOARDING_FORMS.EDIT(form.id)}
                    className="flex items-center gap-1.5"
                  >
                    <SquarePen className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
                    <span>Edit Form</span>
                  </Link>
                </Button>
              </DisabledTooltip>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <OnboardingFormDeletionDialog onboardingForm={form} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
