"use client";

import { ArrowLeft, Receipt } from "lucide-react";
import Link from "next/link";
import React from "react";

import InvoiceForm from "@/components/admin/features/invoices/invoice-form";
import InvoiceFormSkeleton from "@/components/admin/features/invoices/invoice-form-skeleton";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useRequest } from "@/hooks/use-request";
import { Invoice } from "@/types/admin/invoice";

export default function EditInvoicePage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const resolvedParameters = React.use(params);

  const { data: invoice, loading: isLoading } = useRequest({
    url: ENDPOINTS.ADMIN.INVOICES.SHOW(resolvedParameters.id),
    queryKey: ["admin-invoice", resolvedParameters.id],
  });

  const loadedInvoice = invoice?.data as Invoice | undefined;

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={Receipt}
        title="Edit Invoice"
        description="Update invoice details including customer information, amount, issue and due dates, payment method, and payment status to keep records accurate and up to date."
        actions={
          <Button variant="outline" asChild>
            <Link
              href={PATHS.ADMIN.INVOICES.LIST}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:!bg-gray-100 hover:!text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        }
      />

      {isLoading && <InvoiceFormSkeleton />}

      {!isLoading && loadedInvoice && <InvoiceForm invoice={loadedInvoice} />}
    </div>
  );
}
