"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  Archive,
  CalendarDays,
  CheckCircle,
  Ellipsis,
  Eye,
  FileEdit,
  SquarePen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import ProgramArchiveButton from "@/components/admin/features/programs/program-archive-button";
import ProgramDeletionDialog from "@/components/admin/features/programs/program-deletion-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
export const programsTableColumns: ColumnDef<Program>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column}>Program</SortableHeader>,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const program = row.original;
      const description = program.description || "-";
      const thumbnailUrl = program.thumbnail;

      const meta = statusMeta[program.status];

      return (
        <div className="flex min-w-0 items-start gap-4">
          <Avatar className="size-12 shrink-0 rounded-md">
            <AvatarImage src={thumbnailUrl} alt={title} className="object-cover" />
            <AvatarFallback className="border-muted size-12 rounded-md border bg-gray-100">
              <Image src="/images/no-image.png" alt="No image" width={32} height={32} />
            </AvatarFallback>
          </Avatar>
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
            <div className="text-muted-foreground line-clamp-1 max-w-full wrap-break-word whitespace-pre-line">
              {description}
            </div>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },

  {
    accessorKey: "duration",
    header: () => "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as string;
      return <span className="text-sm font-medium text-neutral-800">{duration}</span>;
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
    accessorKey: "published at",
    header: () => "Published At",
    cell: ({ row }) => {
      const publishedAt = row.original.published_at as string | null;
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
              className="hover:text-foreground! ml-auto size-8 cursor-pointer items-center justify-center hover:bg-gray-100!"
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
              <Button
                asChild
                variant="outline"
                className="hover:bg-accent/10! group hover:text-accent! hover:ring-none! focus:ring-none! flex w-full cursor-pointer! items-center justify-start gap-1.5 border-none! text-sm font-medium text-gray-700 shadow-none hover:border-0! disabled:hover:bg-transparent! disabled:hover:text-inherit!"
                aria-label="Preview program"
              >
                <Link href={PATHS.ADMIN.PROGRAMS.PREVIEW(program.slug)}>
                  <Eye className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
                  <span>Preview</span>
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <ProgramArchiveButton program={program} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {(() => {
                const editAllowed = Boolean(program.actions?.edit?.allowed);
                const editReasons = program.actions?.edit?.reasons ?? [];
                const editDisabledReason =
                  editAllowed || editReasons.length === 0
                    ? undefined
                    : editReasons[0]?.trim() || undefined;

                return (
                  <DisabledTooltip reason={editDisabledReason}>
                    <Button
                      asChild
                      variant="outline"
                      className="hover:bg-accent/10! group hover:text-accent! hover:ring-none! flex w-full cursor-pointer! items-center justify-start gap-1.5 border-none! text-sm font-medium text-gray-700 shadow-none disabled:hover:bg-transparent! disabled:hover:text-inherit!"
                      aria-label="Edit program"
                      disabled={!editAllowed}
                    >
                      <Link
                        href={PATHS.ADMIN.PROGRAMS.EDIT(program.id)}
                        aria-disabled={!editAllowed}
                        tabIndex={editAllowed ? 0 : -1}
                      >
                        <SquarePen className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
                        <span>Edit Program</span>
                      </Link>
                    </Button>
                  </DisabledTooltip>
                );
              })()}
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
