"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  CalendarDays,
  Check,
  CheckCircle,
  CirclePause,
  Copy,
  SquarePen,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import { Enrollment } from "@/types/admin/enrollment";

import EnrollmentDeletionDialog from "./enrollment-deletion-dialog";

const statusMeta = {
  pending: {
    variant: "secondary" as const,
    icon: CalendarDays,
    label: "Pending",
    badgeClass: "bg-yellow-100 text-yellow-700",
    iconClass: "text-yellow-700 h-3.5 w-3.5",
  },
  active: {
    variant: "secondary" as const,
    icon: Check,
    label: "Active",
    badgeClass: "bg-green-100 text-green-700",
    iconClass: "text-green-700 h-3.5 w-3.5",
  },
  paused: {
    variant: "secondary" as const,
    icon: CirclePause,
    label: "Paused",
    badgeClass: "bg-orange-100 text-orange-700",
    iconClass: "text-orange-700 h-3.5 w-3.5",
  },
  completed: {
    variant: "secondary" as const,
    icon: CheckCircle,
    label: "Completed",
    badgeClass: "bg-blue-100 text-blue-700",
    iconClass: "text-blue-700 h-3.5 w-3.5",
  },
  canceled: {
    variant: "secondary" as const,
    icon: XCircle,
    label: "Canceled",
    badgeClass: "bg-red-100 text-red-700",
    iconClass: "text-red-700 h-3.5 w-3.5",
  },
};

export const enrollmentsTableColumns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "unique_id",
    header: "Unique ID",
    cell: ({ row }) => {
      const uniqueId = row.getValue("unique_id") as string;

      // Inline component so we can use hooks
      const UniqueIdCell = () => {
        const [copied, setCopied] = React.useState(false);

        const displayId = uniqueId.length > 15 ? uniqueId.slice(0, 20) + "..." : uniqueId;

        const copyToClipboard = () => {
          navigator.clipboard.writeText(uniqueId);
          setCopied(true);
          toast.success("Copied!");

          setTimeout(() => setCopied(false), 1500);
        };

        return (
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-semibold">{displayId}</span>

            <button
              onClick={copyToClipboard}
              className="text-muted-foreground hover:text-foreground transition-all"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 cursor-pointer" />
              )}
            </button>
          </div>
        );
      };

      return <UniqueIdCell />;
    },
  },
  {
    accessorKey: "user.name",
    header: "User",
    cell: ({ row }) => {
      const userName = row.original.user?.name || "—";

      return <div className="text-muted-foreground text-sm">{userName}</div>;
    },
  },
  {
    accessorKey: "team.name",
    header: "Team",
    cell: ({ row }) => {
      const teamName = row.original.team?.name || "—";
      return <div className="text-muted-foreground text-sm">{teamName}</div>;
    },
  },
  {
    accessorKey: "program.title",
    header: "Program",
    cell: ({ row }) => {
      const programName = row.original.program?.title || "—";
      return <div className="text-muted-foreground text-sm">{programName}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "pending";
      const meta = statusMeta[status] || statusMeta.pending;

      return (
        <Badge
          variant={meta.variant}
          className={`pointer-events-none flex items-center gap-1 font-semibold ${meta.badgeClass}`}
        >
          <meta.icon className={meta.iconClass} />
          <span>{meta.label}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.original.duration_value + " " + row.original.duration_unit;
      return <div className="text-muted-foreground text-sm">{duration}</div>;
    },
  },
  {
    accessorKey: "started_at",
    header: "Started At",
    cell: ({ row }) => {
      const startedAt = dayjs(row.original.started_at).format("DD-MMMM-YYYY") || "—";
      return <div className="text-muted-foreground text-sm">{startedAt}</div>;
    },
  },
  {
    accessorKey: "ended_",
    header: "Ended At",
    cell: ({ row }) => {
      const endedAt = dayjs(row.original.ended_at).format("DD-MMMM-YYYY") || "—";
      return <div className="text-muted-foreground text-sm">{endedAt}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const enrollment = row.original;

      return (
        <div className="flex items-center space-x-0.5">
          <DisabledTooltip
            reason={
              enrollment.actions?.editable
                ? undefined
                : "You don't have permission to edit this enrollment."
            }
          >
            <Button
              variant="ghost"
              size="sm"
              asChild
              disabled={!Boolean(enrollment.actions?.editable)}
            >
              <Link
                href={PATHS.ADMIN.ENROLLMENTS.EDIT(enrollment.id)}
                className="hover:bg-accent/10 hover:text-accent text-accent flex cursor-pointer items-center justify-center text-sm font-semibold disabled:hover:!bg-transparent disabled:hover:!text-inherit"
              >
                <SquarePen className="h-2 w-2" />
                <span>Edit</span>
              </Link>
            </Button>
          </DisabledTooltip>

          <EnrollmentDeletionDialog enrollment={enrollment} />
        </div>
      );
    },
  },
];
