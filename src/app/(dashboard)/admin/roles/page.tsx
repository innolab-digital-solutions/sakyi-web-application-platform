import { ClipboardCheck, Plus } from "lucide-react";

import RoleForm from "@/components/admin/roles/form";
import { RolesTable } from "@/components/admin/roles/table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";

export default function RoleListPage() {
  return (
    <>
      <PageHeader
        icon={ClipboardCheck}
        title="Roles & Permissions"
        description=" Manage roles and permissions for your application."
        actions={
          <>
            <RoleForm
              mode="create"
              trigger={
                <Button
                  variant="default"
                  className="flex h-10 w-full cursor-pointer items-center gap-2 text-sm font-medium sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Role</span>
                </Button>
              }
            />
          </>
        }
      />

      <RolesTable />
    </>
  );
}
