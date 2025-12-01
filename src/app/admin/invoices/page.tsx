import { Plus, Receipt } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import InvoiceTable from "@/components/admin/features/invoices/invoice-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Invoices — SaKyi Health & Wellness",
  description: "Create, edit, and publish articles that educate and inspire your audience.",
};

export default function InvoiceListPage() {
  return (
    <ResourceListPage
      icon={Receipt}
      title="Invoices"
      description="Draft, review, and publish posts with the right metadata and categories for a great reading experience."
      createTrigger={
        <Button
          asChild
          variant="default"
          className="flex cursor-pointer items-center gap-2 font-semibold"
        >
          <Link href={PATHS.ADMIN.INVOICES.CREATE}>
            <Plus className="h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      }
      table={<InvoiceTable />}
    />
  );
}
