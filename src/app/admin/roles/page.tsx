import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import RoleForm from "@/components/admin/features/roles/role-form";
import RoleTable from "@/components/admin/features/roles/role-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Roles - SaKyi Health & Wellness",
  description:
    "Define and organize administrative access across the platform. Create roles, refine permissions, and keep your team aligned and secure.",
};

export default function RolesListPage() {
  return (
    <ResourceListPage
      icon={ShieldCheck}
      title="Roles & Permissions"
      description="Create roles and fine‑tune permissions to ensure the right people have the right access—nothing more, nothing less."
      createTrigger={<RoleForm mode="create" trigger={<CreateButton label="Add Role" />} />}
      table={<RoleTable />}
    />
  );
}
