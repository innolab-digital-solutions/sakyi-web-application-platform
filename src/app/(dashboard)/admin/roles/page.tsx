import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import RoleForm from "@/components/admin/features/roles/role-form";
import RoleTable from "@/components/admin/features/roles/role-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Roles & Permissions | SaKyi Health & Wellness",
  description:
    "Manage roles and permissions to control administrative access and streamline capabilities throughout the dashboard.",
};

export default function RolesListPage() {
  return (
    <ResourceListPage
      icon={ShieldCheck}
      title="Roles & Permissions"
      description="Manage roles and permissions to control administrative access and streamline capabilities throughout the dashboard."
      createTrigger={<RoleForm mode="create" trigger={<CreateButton label="Add Role" />} />}
      table={<RoleTable />}
    />
  );
}
