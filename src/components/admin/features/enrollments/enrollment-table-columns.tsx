"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Activity, CalendarClock, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

import SortableHeader from "@/components/shared/table/sortable-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Enrollment } from "@/types/admin/enrollment";
import { cn } from "@/utils/shared/cn";

const statusMeta: Record<
  Enrollment["status"],
  {
    label: string;
    badgeClass: string;
    icon: React.ReactNode;
  }
> = {
  scheduled: {
    icon: <CalendarClock className="h-3.5 w-3.5" />,
    label: "Scheduled",
    badgeClass: "bg-slate-100 text-slate-700",
  },

  active: {
    icon: <Activity className="h-3.5 w-3.5" />,
    label: "Active",
    badgeClass: "bg-green-100 text-green-700",
  },

  completed: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    label: "Completed",
    badgeClass: "bg-sky-100 text-sky-700",
  },

  cancelled: {
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: "Cancelled",
    badgeClass: "bg-red-100 text-red-700",
  },
};

export const enrollmentsTableColumns: ColumnDef<Enrollment>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => <SortableHeader column={column}>Code</SortableHeader>,
    cell: ({ row }) => (
      <div className="text-foreground flex items-center gap-1 text-[13px] font-semibold">
        {row.original.code ?? "-"}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "program",
    header: () => "Program",
    cell: ({ row }) => {
      const program = row.original.program;

      return (
        <div className="flex items-center gap-2">
          <div>
            <Avatar className="size-12 rounded-md">
              <AvatarImage
                src={program?.thumbnail ?? undefined}
                alt={program?.title ?? "Program thumbnail"}
                className="object-cover"
              />
              <AvatarFallback className="border-muted size-12 rounded-md border bg-gray-100">
                <Image src="/images/no-image.png" alt="No image" width={32} height={32} />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-neutral-800">
              {program?.title ?? "Unknown program"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "client",
    header: () => "Client",
    cell: ({ row }) => {
      const client = row.original.client;

      return (
        <div className="flex items-center gap-2">
          <div>
            <Avatar>
              <AvatarImage
                src={client?.picture ?? undefined}
                alt={client?.name ?? "Client avatar"}
              />
              <AvatarFallback>{client?.name?.[0] ?? "C"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-neutral-800">
              {client?.name ?? "Unknown client"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "assigned team",
    header: () => "Assigned Team",
    cell: ({ row }) => {
      const team = row.original.team;
      return <div className="text-sm font-medium text-neutral-800">{team?.name && team.name}</div>;
    },
  },
  {
    accessorKey: "starts at",
    header: () => "Starts At",
    cell: ({ row }) => {
      const startsAt = row.original.starts_at as string | null;
      if (!startsAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed font-semibold!"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="ml-1">Not scheduled</span>
          </Badge>
        );
      }

      const formatted = dayjs(startsAt).isValid()
        ? dayjs(startsAt).format("DD-MMMM-YYYY")
        : startsAt;

      return <div className="text-sm font-medium text-gray-700">{formatted}</div>;
    },
  },
  {
    accessorKey: "ends at",
    header: () => "Ends At",
    cell: ({ row }) => {
      const endsAt = row.original.ends_at as string | null;
      if (!endsAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed font-semibold!"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="ml-1">Not ended</span>
          </Badge>
        );
      }

      const formatted = dayjs(endsAt).isValid() ? dayjs(endsAt).format("DD-MMMM-YYYY") : endsAt;

      return <div className="text-sm font-medium text-gray-700">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              statusMeta[status].badgeClass,
              "pointer-events-none flex items-center gap-1 !text-[13px] font-semibold",
            )}
          >
            {statusMeta[status].icon}
            <span className="ml-1 capitalize">{statusMeta[status].label}</span>
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "completed at",
    header: () => "Completed At",
    cell: ({ row }) => {
      const completedAt = row.original.completed_at as string | null;
      if (!completedAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground border-dashed font-semibold!"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="ml-1">Not completed</span>
          </Badge>
        );
      }

      const formatted = dayjs(completedAt).isValid()
        ? dayjs(completedAt).format("DD-MMMM-YYYY")
        : completedAt;

      return <div className="text-sm font-medium text-gray-700">{formatted}</div>;
    },
  },
  {
    accessorKey: "cancelled at",
    header: () => "Cancelled At",
    cell: ({ row }) => {
      const cancelledAt = row.original.cancelled_at as string | null;
      if (!cancelledAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground border-dashed font-semibold!"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="ml-1">Not cancelled</span>
          </Badge>
        );
      }

      const formatted = dayjs(cancelledAt).isValid()
        ? dayjs(cancelledAt).format("DD-MMMM-YYYY")
        : cancelledAt;

      return <div className="text-sm font-medium text-gray-700">{formatted}</div>;
    },
  },
  {
    accessorKey: "created at",
    header: () => "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.created_at as string | null;
      if (!createdAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground border-dashed font-semibold!"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="ml-1">Not created</span>
          </Badge>
        );
      }

      const formatted = dayjs(createdAt).isValid()
        ? dayjs(createdAt).format("DD-MMMM-YYYY")
        : createdAt;

      return <div className="text-sm font-medium text-gray-700">{formatted}</div>;
    },
  },
];
