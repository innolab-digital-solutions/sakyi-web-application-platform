import { Plus, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import UserTable from "@/components/admin/features/users/user-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "User Management — SaKyi Health & Wellness",
  description:
    "Manage users, roles, and permissions with clarity. Easily create, update, and organize user accounts across your system.",
};

export default function UserListPage() {
  return (
    <ResourceListPage
      icon={Users}
      title="User Management"
      description="Create, organize, and maintain user accounts(light profile) with ease. Assign role and keep your team structure clear and up to date.
"
      createTrigger={
        <Button asChild>
          <Link
            href={PATHS.ADMIN.USERS.CREATE}
            className="flex cursor-pointer items-center gap-2 font-semibold"
          >
            <Plus className="h-4 w-4" />
            Add User
          </Link>
        </Button>
      }
      table={<UserTable />}
    />
  );
}
