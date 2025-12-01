"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Check, CheckCircle, CirclePause, Copy, SquarePen, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import { Invoice } from "@/types/admin/invoice";

import InvoiceDeletionDialog from "./invoice-deletion-dialog";

const statusMeta = {
  pending: {
    variant: "secondary" as const,
    icon: CirclePause,
    label: "Pending",
    badgeClass: "bg-yellow-100 text-yellow-700",
    iconClass: "text-yellow-700 h-3.5 w-3.5",
  },
  paid: {
    variant: "secondary" as const,
    icon: CheckCircle,
    label: "Paid",
    badgeClass: "bg-green-100 text-green-700",
    iconClass: "text-green-700 h-3.5 w-3.5",
  },
  refunded: {
    variant: "secondary" as const,
    icon: XCircle,
    label: "Refunded",
    badgeClass: "bg-blue-100 text-blue-700",
    iconClass: "text-blue-700 h-3.5 w-3.5",
  },
  cancelled: {
    variant: "secondary" as const,
    icon: XCircle,
    label: "Cancelled",
    badgeClass: "bg-red-100 text-red-700",
    iconClass: "text-red-700 h-3.5 w-3.5",
  },
};

export const invoicesTableColumns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoice_number",
    header: "Invoice #",
    cell: ({ row }) => {
      const invoiceNumber = row.getValue("invoice_number") as string;

      const InvoiceNumberCell = () => {
        const [copied, setCopied] = React.useState(false);
        const copyToClipboard = () => {
          navigator.clipboard.writeText(invoiceNumber);
          setCopied(true);
          toast.success("Copied!");
          setTimeout(() => setCopied(false), 1500);
        };

        return (
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-semibold">{invoiceNumber}</span>
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

      return <InvoiceNumberCell />;
    },
  },
  {
    accessorKey: "enrollment",
    header: "Enrollment",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.enrollment?.unique_id ?? "—"}
      </div>
    ),
  },
  {
    accessorKey: "user.name",
    header: "Client",
    cell: ({ row }) => {
      const user = row.original.user;
      if (!user) {
        return <span className="text-muted-foreground text-sm">—</span>;
      }

      const avatar = user.picture;
      const initial = user.name?.[0] ?? "?";

      return (
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
            {avatar ? (
              <Image src={avatar} alt={user.name} width={32} height={32} />
            ) : (
              <span>{initial}</span>
            )}
          </div>
          <span className="text-sm font-semibold">{user.name}</span>
        </div>
      );
    },
  },

  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = Number(row.original.amount); // cast to number
      return (
        <div className="text-muted-foreground text-sm">
          {row.original.currency} {Number.isNaN(amount) ? "0.00" : amount.toFixed(2)}
        </div>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Payment Method",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.payment_method?.name ?? "—"}
      </div>
    ),
  },
  {
    accessorKey: "issue_date",
    header: "Issued Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.issued_date ? dayjs(row.original.issued_date).format("DD-MMMM-YYYY") : "—"}
      </div>
    ),
  },
  {
    accessorKey: "paid_date",
    header: "Paid Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-sm">
        {row.original.paid_date ? dayjs(row.original.paid_date).format("DD-MMMM-YYYY") : "—"}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status || "draft";
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
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground w-52 truncate text-sm">
          {row.original.notes || "—"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <div className="flex items-center space-x-0.5">
          <DisabledTooltip
            reason={
              invoice.actions?.editable
                ? undefined
                : "You don't have permission to edit this invoice."
            }
          >
            <Button
              variant="ghost"
              size="sm"
              asChild
              disabled={!Boolean(invoice.actions?.editable)}
            >
              <Link
                href={PATHS.ADMIN.INVOICES.EDIT(invoice.id)}
                className="hover:bg-accent/10 hover:text-accent text-accent flex cursor-pointer items-center justify-center text-sm font-semibold disabled:hover:!bg-transparent disabled:hover:!text-inherit"
              >
                <SquarePen className="h-2 w-2" />
                <span>Edit</span>
              </Link>
            </Button>
          </DisabledTooltip>

          <InvoiceDeletionDialog invoice={invoice} />
        </div>
      );
    },
  },
];
