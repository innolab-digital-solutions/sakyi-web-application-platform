"use client";

import { Plus, UserCog2 } from "lucide-react";

import UserForm from "@/components/admin/features/users/user-form";
import UserTable from "@/components/admin/features/users/user-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";
import { Button } from "@/components/ui/button";

export default function UserListPage() {
  return (
    <ResourceListPage
      icon={UserCog2}
      title="User Management"
      description="Create, organize, and maintain user accounts(light profile) with ease. Assign role and keep your team structure clear and up to date.
"
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
