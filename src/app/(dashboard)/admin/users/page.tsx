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
    "Create and manage users with clear outcomes and structure. Keep offerings organized and easy to maintain.",
};

export default function UserListPage() {
  return (
    <ResourceListPage
      icon={Users}
      title="User Management"
      description="Design, organize, and maintain your programs. Publish with clear outcomes and structure so clients know exactly what to expect."
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
