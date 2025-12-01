import { CreditCard } from "lucide-react";
import type { Metadata } from "next";

import PaymentMethodForm from "@/components/admin/features/payment-methods/payment-method-form";
import PaymentMethodTable from "@/components/admin/features/payment-methods/payment-method-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Payments — SaKyi Health & Wellness",
  description:
    "View and manage all payment transactions made by clients for programs, products, and services.",
};

export default function PaymentListPage() {
  return (
    <ResourceListPage
      icon={CreditCard}
      title="Payment Methods"
      description="Track and manage all payment methods, including completed, pending, and refunded transactions."
      createTrigger={
        <PaymentMethodForm mode="create" trigger={<CreateButton label="Add Payment Method" />} />
      }
      table={<PaymentMethodTable />}
    />
  );
}
