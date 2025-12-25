"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CheckCircle, Clock, Ellipsis, FileEdit, SquarePen, XCircle } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import InstructionDeletionDialog from "@/components/admin/features/instructions/instruction-deletion-dialog";
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
import { Instruction } from "@/types/admin/instruction";
import { cn } from "@/utils/shared/cn";

function InstructionActionsCell({ instruction }: { instruction: Instruction }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
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
          Instruction Actions
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          onSelect={(event) => {
            if (instruction.actions?.editable) {
              setDropdownOpen(false);
            } else {
              event.preventDefault();
            }
          }}
        >
          {(() => {
            const isEditable = Boolean(instruction.actions?.editable);
            const disabledReason = isEditable
              ? undefined
              : "You don't have permission to edit this instruction.";
            return (
              <DisabledTooltip reason={disabledReason}>
                <Button
                  asChild
                  variant="outline"
                  className="hover:!bg-accent/10 group hover:!text-accent hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium text-gray-700 shadow-none"
                  aria-label="Edit instruction"
                  disabled={!isEditable}
                >
                  <Link href={PATHS.ADMIN.INSTRUCTIONS.EDIT(instruction.id)}>
                    <SquarePen className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
                    <span>Edit Instruction</span>
                  </Link>
                </Button>
              </DisabledTooltip>
            );
          })()}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          asChild
          onSelect={(event) => {
            setDropdownOpen(false);
            event.preventDefault();
          }}
        >
          <InstructionDeletionDialog instruction={instruction} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const statusMeta: Record<
  Instruction["status"],
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
  active: {
    variant: "secondary",
    icon: CheckCircle,
    label: "Active",
    badgeClass: "bg-green-100 text-green-700",
    iconClass: "text-green-700 h-3.5 w-3.5",
  },
  completed: {
    variant: "secondary",
    icon: Clock,
    label: "Completed",
    badgeClass: "bg-blue-100 text-blue-700",
    iconClass: "text-blue-700 h-3.5 w-3.5",
  },
  cancelled: {
    variant: "secondary",
    icon: XCircle,
    label: "Cancelled",
    badgeClass: "bg-red-100 text-red-700",
    iconClass: "text-red-700 h-3.5 w-3.5",
  },
};

export const instructionTableColumns: ColumnDef<Instruction>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column}>Title</SortableHeader>,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const instruction = row.original;
      const notes = instruction.notes || "-";

      const meta = statusMeta[instruction.status];
      const Icon = meta.icon;

      return (
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
              <Icon className={meta.iconClass} />
              <span>{meta.label}</span>
            </Badge>
          </div>
          <div className="text-muted-foreground max-w-full text-xs break-words whitespace-pre-line">
            {notes}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "enrollment",
    header: () => "Enrollment",
    cell: ({ row }) => {
      const instruction = row.original;
      const enrollment = instruction.enrollment;

      return (
        <div className="flex flex-col gap-1">
          <span className="text-foreground text-sm font-medium">
            {enrollment.unique_id || `#${enrollment.id}`}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "doctor",
    header: () => "Doctor",
    cell: ({ row }) => {
      const instruction = row.original;
      const doctor = instruction.doctor;

      return (
        <div className="flex flex-col gap-1">
          <span className="text-foreground text-sm font-medium">{doctor.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "total_days",
    header: ({ column }) => <SortableHeader column={column}>Duration</SortableHeader>,
    cell: ({ row }) => {
      const instruction = row.original;
      const startDate = instruction.start_date;
      const endDate = instruction.end_date;
      const totalDays = instruction.total_days;

      const formattedStart = dayjs(startDate).isValid()
        ? dayjs(startDate).format("DD MMM YYYY")
        : startDate;
      const formattedEnd = dayjs(endDate).isValid()
        ? dayjs(endDate).format("DD MMM YYYY")
        : endDate;

      return (
        <div className="flex flex-col gap-1">
          <span className="text-foreground text-sm font-medium">
            {totalDays} {totalDays === 1 ? "day" : "days"}
          </span>
          <span className="text-muted-foreground text-xs">
            {formattedStart} - {formattedEnd}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => <InstructionActionsCell instruction={row.original} />,
  },
];
