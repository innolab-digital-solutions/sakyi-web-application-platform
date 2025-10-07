import { Plus, ShieldCheck } from "lucide-react";

import RoleForm from "@/components/admin/features/roles/role-form";
import RoleTable from "@/components/admin/features/roles/role-table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function RolesListPage() {
  return (
    <>
      <PageHeader
        icon={ShieldCheck}
        title="Roles & Permissions"
        description="Manage user roles and permissions to control administrative access and user capabilities throughout the dashboard."
        actions={
          <>
            <RoleForm
              mode="create"
              trigger={
                <Button
                  variant="default"
                  className="flex cursor-pointer items-center font-semibold"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Role</span>
                </Button>
              }
            />
          </>
        }
      />

      <RoleTable />
    </>
  );
}
