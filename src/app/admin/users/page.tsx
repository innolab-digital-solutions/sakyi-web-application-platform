"use client";

import { Plus } from "lucide-react";

import UserForm from "@/components/admin/features/users/user-form";
import UserTable from "@/components/admin/features/users/user-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";
import { Button } from "@/components/ui/button";

export default function UserListPage() {
  return (
    <ResourceListPage
      title="User Management"
      description="Create and maintain all user accounts in the system. Use roles to promote accounts to admin or staff access while leaving others as standard client profiles."
      createTrigger={
        <UserForm
          mode="create"
          trigger={
            <Button className="flex cursor-pointer items-center gap-2 font-semibold">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          }
        />
      }
      table={<UserTable />}
    />
  );
}
