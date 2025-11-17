"use client";

import { ArrowLeft, ClipboardList, Users } from "lucide-react";
import Link from "next/link";
import React from "react";

import UserForm from "@/components/admin/features/users/user-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useRequest } from "@/hooks/use-request";
import { User } from "@/types/admin/user";

export default function EditUserPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const resolvedParameters = React.use(params);

  const { data } = useRequest({
    url: ENDPOINTS.ADMIN.USERS.SHOW(resolvedParameters.id),
    queryKey: ["admin-user", resolvedParameters.id],
  });

  const loadedUser = (data?.data as User) || undefined;

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={Users}
        title="Edit Program"
        description="Update details and structure with confidence. Refine the basics or adjust audience, features, outcomes, and weekly plan—changes help clients understand what’s new."
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

      <UserForm user={loadedUser} />
    </div>
  );
}
