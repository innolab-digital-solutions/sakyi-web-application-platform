"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  Archive,
  CalendarDays,
  CheckCircle,
  ClipboardCheck,
  Ellipsis,
  FileEdit,
  SquarePen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import ProgramDeletionDialog from "@/components/admin/features/programs/program-deletion-dialog";
import ProgramStatusDialog from "@/components/admin/features/programs/program-status-dialog";
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
import { Program } from "@/types/admin/program";
import { cn } from "@/utils/shared/cn";

import ProgramStatusSwitch from "./program-status-switch";

const statusMeta: Record<
  Program["status"],
  {
    variant: "secondary";
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    badgeClass: string;
    iconClass: string;
  }
> = {
  draft: {
    variant: "secondary",
    icon: FileEdit,
    label: "Draft",
    badgeClass: "bg-yellow-100 text-yellow-700",
    iconClass: "text-yellow-700 h-3.5 w-3.5",
  },
  published: {
    variant: "secondary",
    icon: CheckCircle,
    label: "Published",
    badgeClass: "bg-green-100 text-green-700",
    iconClass: "text-green-700 h-3.5 w-3.5",
  },
  archived: {
    variant: "secondary",
    icon: Archive,
    label: "Archived",
    badgeClass: "bg-slate-100 text-slate-700",
    iconClass: "text-slate-700 h-3.5 w-3.5",
  },
};

const durationUnitLabel: Record<Program["duration_unit"], string> = {
  days: "day(s)",
  weeks: "week(s)",
  months: "month(s)",
};

export const programsTableColumns: ColumnDef<Program>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column}>Program</SortableHeader>,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const program = row.original;
      const description = program.description || "-";
      const thumbnailUrl = program.thumbnail_url;

      const meta = statusMeta[program.status];

      return (
        <div className="flex min-w-0 items-start gap-4">
          <div className="bg-muted/50 ring-muted-foreground/5 relative size-12 flex-shrink-0 overflow-hidden rounded-md ring-1">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 48px, 48px"
                unoptimized={thumbnailUrl.startsWith("http")}
              />
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
                  "pointer-events-none flex items-center gap-1 !font-semibold",
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
    id: "onboarding_form",
    header: () => "Onboarding Form",
    cell: ({ row }) => {
      const program = row.original;
      const attachedForm = program.attached_onboarding_form;

      if (!attachedForm || !attachedForm.title) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            <span className="ml-1">No form</span>
          </Badge>
        );
      }

      return (
        <div className="flex items-center gap-2">
          <ClipboardCheck className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium text-neutral-800">{attachedForm.title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "duration_value",
    header: () => "Duration",
    cell: ({ row }) => {
      const { duration_value, duration_unit } = row.original;
      if (!duration_value || !duration_unit) return <span>-</span>;
      return (
        <span className="text-sm font-medium text-neutral-800">
          {duration_value} {durationUnitLabel[duration_unit]}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => <SortableHeader column={column}>Price</SortableHeader>,
    cell: ({ row }) => {
      const price = row.getValue("price") as string;
      const currency = row.original.currency;
      return (
        <span className="text-sm font-medium text-neutral-800">
          {price} {currency}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => "Publish ?",
    cell: ({ row }) => {
      const program = row.original;
      return (
        <div className="flex items-center justify-center">
          {program.status === "archived" ? (
            <span className="text-muted-foreground text-sm font-medium">-</span>
          ) : (
            <ProgramStatusSwitch program={program} />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "published_at",
    header: ({ column }) => <SortableHeader column={column}>Published At</SortableHeader>,
    cell: ({ row }) => {
      const publishedAt = row.getValue("published_at") as string | null;
      if (!publishedAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
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
      const program = row.original;

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
              Program Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              {(() => {
                const isEditable = Boolean(program.actions?.editable);
                const disabledReason = isEditable
                  ? undefined
                  : "You don't have permission to edit this program.";
                return (
                  <DisabledTooltip reason={disabledReason}>
                    <Button
                      asChild
                      variant="outline"
                      className="hover:!bg-accent/10 group hover:!text-accent hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium text-gray-700 shadow-none"
                      aria-label="Edit program"
                      disabled={!isEditable}
                    >
                      <Link href={PATHS.ADMIN.PROGRAMS.EDIT(program.id)}>
                        <SquarePen className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
                        <span>Edit Program</span>
                      </Link>
                    </Button>
                  </DisabledTooltip>
                );
              })()}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ProgramStatusDialog program={program} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <ProgramDeletionDialog program={program} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
