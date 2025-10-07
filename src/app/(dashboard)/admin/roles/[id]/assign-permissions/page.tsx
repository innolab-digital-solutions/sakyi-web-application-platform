"use client";

import { ArrowLeft, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

interface RolePermissionsAssignmentPageProperties {
  params: Promise<{
    id: string;
  }>;
}

export default function RolePermissionsAssignmentPage({
  params,
}: RolePermissionsAssignmentPageProperties) {
  const resolvedParameters = React.use(params);

  return (
    <>
      <PageHeader
        icon={ClipboardCheck}
        title="Assign Permissions"
        description="Assign permissions to a role to control administrative access and user capabilities throughout the dashboard."
        actions={
          <Button variant="outline" asChild>
            <Link
              href={PATHS.ADMIN.ROLES.LIST}
              className="flex items-center gap-2 bg-gray-100 text-sm font-semibold text-gray-800 hover:bg-gray-200 hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Roles
            </Link>
          </Button>
        }
      />
    </>
  );
}
