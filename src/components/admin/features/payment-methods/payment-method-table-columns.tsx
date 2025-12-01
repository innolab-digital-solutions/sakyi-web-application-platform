"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, SquarePen, XCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/types/admin/payment-method";
import { cn } from "@/utils/shared/cn";

import PaymentMethodDeletionDialog from "./payment-method-deletion-dialog";
import PaymentMethodForm from "./payment-method-form";

const statusMeta: Record<
  PaymentMethod["status"],
  {
    label: string;
    badgeClass: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconClass: string;
  }
> = {
  active: {
    label: "Active",
    badgeClass: "bg-green-100 text-green-700",
    icon: CheckCircle,
    iconClass: "text-green-700 h-3.5 w-3.5",
  },
  inactive: {
    label: "Inactive",
    badgeClass: "bg-red-100 text-red-700",
    icon: XCircle,
    iconClass: "text-red-700 h-3.5 w-3.5",
  },
  archived: {
    label: "Archived",
    badgeClass: "bg-slate-100 text-slate-700",
    icon: XCircle,
    iconClass: "text-slate-700 h-3.5 w-3.5",
  },
};

export const paymentMethodsTableColumns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => {
      const method = row.original;
      const logoUrl = method.logo
        ? method.logo.startsWith("http")
          ? method.logo
          : `/${method.logo}`
        : "";

      return (
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-muted/50 ring-muted-foreground/5 relative h-12 w-12 shrink-0 overflow-hidden rounded-md ring-1">
            {logoUrl ? (
              <Image src={logoUrl} alt="logo" fill className="object-cover" />
            ) : (
              <div className="text-muted-foreground/50 flex h-full w-full items-center justify-center text-xs font-medium">
                N/A
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="text-foreground text-sm font-semibold">{method.name}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "qr_code",
    header: "QR Code",
    cell: ({ row }) => {
      const qr = row.original.qr_code;
      const qr_url = qr ? (qr.startsWith("http") ? qr : `/${qr}`) : "";
      return (
        <div className="bg-muted/50 ring-muted-foreground/5 relative h-12 w-12 shrink-0 overflow-hidden rounded-md ring-1">
          {qr_url ? (
            <Image src={qr_url} alt="qr_code" fill className="object-cover" />
          ) : (
            <div className="text-muted-foreground/50 flex h-full w-full items-center justify-center text-xs font-medium">
              N/A
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = statusMeta[row.original.status];
      return (
        <Badge
          variant="secondary"
          className={cn(status.badgeClass, "flex items-center gap-1 font-semibold")}
        >
          <status.icon className={status.iconClass} />
          <span>{status.label}</span>
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const method = row.original;

      return (
        <div className="flex items-center space-x-0.5">
          <PaymentMethodForm
            mode="edit"
            defaultValues={method}
            trigger={(() => {
              const isEditable = Boolean(method.actions?.editable);
              const disabledReason = isEditable
                ? undefined
                : "You don't have permission to edit this unit.";
              return (
                <DisabledTooltip reason={disabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10 hover:text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
                    disabled={!isEditable}
                  >
                    <SquarePen className="h-2 w-2" />
                    <span>Edit</span>
                  </Button>
                </DisabledTooltip>
              );
            })()}
          />

          <PaymentMethodDeletionDialog paymentMethod={method} />
        </div>
      );
    },
  },
];
