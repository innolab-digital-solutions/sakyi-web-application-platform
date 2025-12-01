import { ArrowLeft, Receipt } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import InvoiceForm from "@/components/admin/features/invoices/invoice-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Create Invoice — SaKyi Health & Wellness",
  description:
    "Create a new invoice for a customer, specifying amounts, issue and due dates, payment method, and status.",
};

export default function CreateInvoicePage() {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={Receipt}
        title="Create Invoice"
        description="Generate a new invoice for a customer, set the amount, reference, issue and due dates, assign payment method, and track payment status."
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

      <InvoiceForm />
    </div>
  );
}
