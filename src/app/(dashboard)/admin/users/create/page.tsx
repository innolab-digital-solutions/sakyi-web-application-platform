import { ArrowLeft, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import UserForm from "@/components/admin/features/users/user-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Create User — SaKyi Health & Wellness",
  description: "Add a new user with basic information, profile details, and role assignment.",
};

export default function CreateUserPage() {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={Users}
        title="Create User"
        description="Fill in the user's basic details such as name, email, contact information, profile settings, and assign a role."
        actions={
          <Button variant="outline" asChild>
            <Link
              href={PATHS.ADMIN.USERS.LIST}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:!bg-gray-100 hover:!text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        }
      />

      <UserForm />
    </div>
  );
}
