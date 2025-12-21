"use client";

import React from "react";

import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { PaymentMethod } from "@/types/admin/payment-method";

import { paymentMethodsTableColumns } from "./payment-method-table-columns";

export default function PaymentMethodTable() {
  return (
    <ResourceTable<PaymentMethod>
      endpoint={ENDPOINTS.ADMIN.PAYMENT_METHODS.INDEX}
      queryKey={["admin-payment-methods"]}
      columns={paymentMethodsTableColumns}
      skeleton={{
        customSkeletons: {
          name: (
            <div className="flex items-center gap-2">
              <Skeleton className="size-12 shrink-0 animate-pulse rounded-md" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-32 animate-pulse rounded" />
                <Skeleton className="h-5 w-16 animate-pulse rounded-full" />
              </div>
            </div>
          ),
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No payment methods found. Add a new payment method to get started."
    />
  );
}
