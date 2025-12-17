"use client";

import { Users } from "lucide-react";

import ClientTable from "@/components/admin/features/clients/client-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export default function ClientListPage() {
  return (
    <ResourceListPage
      icon={Users}
      title="Client Management"
      description="Track and manage enrolled clients, their contact details, and program enrollments."
      table={<ClientTable />}
    />
  );
}
