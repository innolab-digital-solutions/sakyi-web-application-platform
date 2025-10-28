"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Archive, CircleCheckBig, Ellipsis, SquarePen, XCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

import ProgramDeletionDialog from "@/components/admin/features/programs/program-deletion-dialog";
import ProgramForm from "@/components/admin/features/programs/program-form";
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
import { Program } from "@/types/admin/program";
import { cn } from "@/utils/shared/cn";

const statusMeta = {
  active: {
    variant: "secondary" as const,
    icon: CircleCheckBig,
    label: "Active",
    badgeClass: "bg-green-100 text-green-700",
    iconClass: "text-green-700 h-3.5 w-3.5",
  },
  inactive: {
    variant: "secondary" as const,
    icon: XCircle,
    label: "Inactive",
    badgeClass: "bg-red-100 text-red-700",
    iconClass: "text-red-700 h-3.5 w-3.5",
  },
  archived: {
    variant: "secondary" as const,
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
    header: () => "Price",
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
              <ProgramForm
                mode="edit"
                defaultValues={program}
                trigger={(() => {
                  const isEditable = Boolean(program.actions?.editable);
                  const disabledReason = isEditable
                    ? undefined
                    : "You don't have permission to edit this program.";
                  return (
                    <DisabledTooltip reason={disabledReason}>
                      <Button
                        variant="outline"
                        className="hover:!bg-accent/10 group hover:!text-accent hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium text-gray-700 shadow-none"
                        aria-label="Edit program"
                        disabled={!isEditable}
                      >
                        <SquarePen className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
                        <span>Edit Program</span>
                      </Button>
                    </DisabledTooltip>
                  );
                })()}
              />
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
