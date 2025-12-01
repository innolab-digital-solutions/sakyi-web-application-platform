"use client";

import React from "react";

import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { Invoice } from "@/types/admin/invoice";

import InvoiceFiltersDropdown from "./invoice-filters-dropdown";
import { invoicesTableColumns } from "./invoice-table-columns";

export default function InvoiceTable() {
  return (
    <ResourceTable<Invoice>
      endpoint={ENDPOINTS.ADMIN.INVOICES.INDEX}
      queryKey={["admin-invoices"]}
      columns={invoicesTableColumns}
      skeleton={{
        customSkeletons: {
          invoice_number: <Skeleton className="h-5 w-24 animate-pulse rounded" />,
          customer_name: <Skeleton className="h-5 w-32 animate-pulse rounded" />,
          status: <Skeleton className="h-5 w-20 animate-pulse rounded" />,
          issue_date: <Skeleton className="h-5 w-24 animate-pulse rounded" />,
          due_date: <Skeleton className="h-5 w-24 animate-pulse rounded" />,
          amount: <Skeleton className="h-5 w-20 animate-pulse rounded" />,
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No invoices found. Create your first invoice to get started."
      filters={<InvoiceFiltersDropdown />}
    />
  );
}
