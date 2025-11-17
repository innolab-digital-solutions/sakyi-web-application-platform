import { ArrowLeft, ClipboardList, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import ProgramForm from "@/components/admin/features/programs/program-form";
import UserForm from "@/components/admin/features/users/user-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Create Program — SaKyi Health & Wellness",
  description:
    "Set up a new program with the essentials, then add audience, features, outcomes, structure, and FAQs.",
};

export default function CreateUserPage() {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={Users}
        title="Create Program"
        description="Set the basics—thumbnail, title, description, duration, and price—then add audience, key features, outcomes, structure, and FAQs."
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
