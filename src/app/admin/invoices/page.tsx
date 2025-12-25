import type { Metadata } from "next";

import InvoiceTable from "@/components/admin/features/invoices/invoice-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Invoices — SaKyi Health & Wellness",
  description:
    "Manage client invoices and billing records. Track invoice status, amounts, payment dates, and payment methods to maintain accurate financial documentation.",
};

export default function InvoiceListPage() {
  return (
    <ResourceListPage
      title="Invoices"
      description="Manage client invoices and billing records. View, track, and organize invoices by client and program, including amounts, payment status, due dates, and payment methods to maintain accurate financial documentation."
      table={<InvoiceTable />}
    />
  );
}
