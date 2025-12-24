"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CalendarDays, CircleCheck, FileEdit, Receipt, XCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

import SortableHeader from "@/components/shared/table/sortable-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Invoice } from "@/types/admin/invoice";
import { cn } from "@/utils/shared/cn";

const statusMeta: Record<
  Invoice["status"],
  {
    label: string;
    badgeClass: string;
    icon: React.ReactNode;
  }
> = {
  draft: {
    icon: <FileEdit className="h-3.5 w-3.5" />,
    label: "Draft",
    badgeClass: "bg-yellow-100 text-yellow-700",
  },
  issued: {
    icon: <Receipt className="h-3.5 w-3.5" />,
    label: "Issued",
    badgeClass: "bg-sky-100 text-sky-700",
  },
  paid: {
    icon: <CircleCheck className="h-3.5 w-3.5" />,
    label: "Paid",
    badgeClass: "bg-green-100 text-green-700",
  },
  void: {
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: "Void",
    badgeClass: "bg-red-100 text-red-700",
  },
};

export const invoicesTableColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoice_number",
    header: ({ column }) => <SortableHeader column={column}>Invoice Number</SortableHeader>,
    cell: ({ row }) => (
      <div className="text-foreground flex items-center gap-1 text-[13px] font-semibold">
        {row.original.invoice_number ?? "-"}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "client",
    header: () => "Client",
    cell: ({ row }) => {
      const client = row.original.enrollment?.client;

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
    accessorKey: "program",
    header: () => "Program",
    cell: ({ row }) => {
      const program = row.original.enrollment?.program;

      return (
        <div className="flex items-center gap-2">
          <div>
            <Avatar className="size-12 rounded-md">
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
    accessorKey: "amount",
    header: ({ column }) => <SortableHeader column={column}>Amount</SortableHeader>,
    cell: ({ row }) => {
      const amount = row.original.amount;
      const currency = row.original.currency;

      return (
        <div className="text-sm font-semibold text-neutral-800">
          {amount?.toLocaleString() ?? "0.00"} {currency}
        </div>
      );
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
    accessorKey: "issued at",
    header: () => "Issued At",
    cell: ({ row }) => {
      const issuedAt = row.original.issued_at as string | null;
      if (!issuedAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed font-semibold!"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="ml-1">Not issued</span>
          </Badge>
        );
      }

      const formatted = dayjs(issuedAt).isValid()
        ? dayjs(issuedAt).format("DD-MMMM-YYYY")
        : issuedAt;

      return <div className="text-sm font-medium text-gray-700">{formatted}</div>;
    },
  },
  {
    accessorKey: "due at",
    header: () => "Due At",
    cell: ({ row }) => {
      const dueAt = row.original.due_at as string | null;
      if (!dueAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed font-semibold!"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="ml-1">Not set</span>
          </Badge>
        );
      }

      const formatted = dayjs(dueAt).isValid() ? dayjs(dueAt).format("DD-MMMM-YYYY") : dueAt;

      return <div className="text-sm font-medium text-gray-700">{formatted}</div>;
    },
  },
  {
    accessorKey: "paid at",
    header: () => "Paid At",
    cell: ({ row }) => {
      const paidAt = row.original.paid_at as string | null;
      if (!paidAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed font-semibold!"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="ml-1">Not paid</span>
          </Badge>
        );
      }

      const formatted = dayjs(paidAt).isValid() ? dayjs(paidAt).format("DD-MMMM-YYYY") : paidAt;

      return <div className="text-sm font-medium text-gray-700">{formatted}</div>;
    },
  },
  {
    accessorKey: "payment method",
    header: () => "Payment Method",
    cell: ({ row }) => {
      const paymentMethod = row.original.payment_method;
      return (
        <div className="text-sm font-medium text-neutral-800">{paymentMethod?.name ?? "-"}</div>
      );
    },
  },
  {
    accessorKey: "reference",
    header: () => "Reference",
    cell: ({ row }) => (
      <div className="text-sm font-medium text-neutral-800">{row.original.reference ?? "-"}</div>
    ),
  },
];
