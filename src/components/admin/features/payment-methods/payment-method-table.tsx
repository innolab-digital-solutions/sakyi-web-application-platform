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
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-6 animate-pulse rounded-md" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-28 animate-pulse rounded" />
                <Skeleton className="h-3 w-16 animate-pulse rounded" />
              </div>
            </div>
          ),
          qr_code: <Skeleton className="h-6 w-6 animate-pulse rounded" />,
          status: <Skeleton className="h-4 w-16 animate-pulse rounded-lg" />,
          created_at: <Skeleton className="h-4 w-20 animate-pulse rounded" />,
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-8 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No payment methods found. Add a new payment method to get started."
    />
  );
}
