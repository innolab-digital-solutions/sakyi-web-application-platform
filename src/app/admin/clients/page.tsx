"use client";

import ClientTable from "@/components/admin/features/clients/client-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export default function ClientListPage() {
  return <ResourceListPage title="Clients" description="" table={<ClientTable />} />;
}
