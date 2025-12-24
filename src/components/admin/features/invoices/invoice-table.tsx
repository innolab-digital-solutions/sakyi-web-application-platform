"use client";

import React from "react";

import { invoicesTableColumns } from "@/components/admin/features/invoices/invoice-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Invoice } from "@/types/admin/invoice";

export default function InvoiceTable() {
  return (
    <ResourceTable<Invoice>
      endpoint={ENDPOINTS.ADMIN.INVOICES.INDEX}
      queryKey={["admin-invoices"]}
      columns={invoicesTableColumns}
      skeleton={{
        customSkeletons: {
          invoice_number: <Skeleton className="h-4 w-32 animate-pulse rounded" />,
          client: (
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 animate-pulse rounded-full" />
              <Skeleton className="h-4 w-32 animate-pulse rounded" />
            </div>
          ),
          program: (
            <div className="flex items-center gap-2">
              <Skeleton className="size-12 shrink-0 animate-pulse rounded-md" />
              <Skeleton className="h-4 w-40 animate-pulse rounded" />
            </div>
          ),
          amount: <Skeleton className="h-4 w-24 animate-pulse rounded" />,
          status: <Skeleton className="h-5 w-20 animate-pulse rounded-full" />,
          "issued at": <Skeleton className="h-5 w-32 animate-pulse rounded" />,
          "due at": <Skeleton className="h-5 w-32 animate-pulse rounded" />,
          "paid at": <Skeleton className="h-5 w-32 animate-pulse rounded" />,
          "payment method": <Skeleton className="h-4 w-28 animate-pulse rounded" />,
          reference: <Skeleton className="h-4 w-24 animate-pulse rounded" />,
        },
      }}
      emptyMessage="No invoices found. Create your first invoice to get started."
    />
  );
}
