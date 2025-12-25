"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, SquarePen, XCircle } from "lucide-react";
import Image from "next/image";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
};

export const paymentMethodsTableColumns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Method</SortableHeader>,
    cell: ({ row }) => {
      const method = row.original;
      return (
        <div className="flex items-center gap-2">
          <div>
            <Avatar className="size-12 rounded-md">
              <AvatarImage
                src={method.logo ?? undefined}
                alt={method.name ?? "logo"}
                className="object-cover"
              />
              <AvatarFallback className="border-muted size-12 rounded-md border bg-gray-100">
                <Image src="/images/no-image.png" alt="No logo" width={32} height={32} />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-foreground text-sm font-semibold">
              {method.name ?? "Unknown method"}
            </div>

            {method.status && (
              <Badge
                variant="secondary"
                className={cn(
                  statusMeta[method.status].badgeClass,
                  "flex items-center gap-1 font-semibold",
                )}
              >
                {statusMeta[method.status].label}
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const paymentMethod = row.original;

      const editAllowed = Boolean(paymentMethod.actions?.edit?.allowed);
      const editReasons = paymentMethod.actions?.edit?.reasons ?? [];
      const editDisabledReason =
        editAllowed || editReasons.length === 0 ? undefined : editReasons[0]?.trim() || undefined;

      return (
        <div className="flex items-center space-x-0.5">
          <PaymentMethodForm
            mode="edit"
            defaultValues={paymentMethod}
            trigger={(() => {
              return (
                <DisabledTooltip reason={editDisabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10 hover:text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
                    disabled={!editAllowed}
                    aria-label="Edit payment method"
                  >
                    <SquarePen className="h-4 w-4" />
                    <span>Edit</span>
                  </Button>
                </DisabledTooltip>
              );
            })()}
          />

          <PaymentMethodDeletionDialog paymentMethod={paymentMethod} />
        </div>
      );
    },
  },
];
