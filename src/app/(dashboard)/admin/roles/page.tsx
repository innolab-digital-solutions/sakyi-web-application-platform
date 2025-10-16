import { Plus, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import RoleForm from "@/components/admin/features/roles/role-form";
import RoleTable from "@/components/admin/features/roles/role-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Roles & Permissions | SaKyi Health & Wellness",
  description:
    "Manage roles and permissions to control administrative access and user capabilities throughout the dashboard.",
};

export default function RolesListPage() {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={ShieldCheck}
        title="Roles & Permissions"
        description="Manage roles and permissions to control administrative access and user capabilities throughout the dashboard."
        actions={
          <RoleForm
            mode="create"
            trigger={
              <Button variant="default" className="flex cursor-pointer items-center font-semibold">
                <Plus className="h-4 w-4" />
                <span>Add Role</span>
              </Button>
            }
          />
        }
      />

      <RoleTable />
    </div>
  );
}
