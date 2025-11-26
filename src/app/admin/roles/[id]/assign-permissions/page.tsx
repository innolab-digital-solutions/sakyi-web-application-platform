"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

import AssignPermissionsForm from "@/components/admin/features/roles/assign-permissions-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useRequest } from "@/hooks/use-request";
import { Role } from "@/types/admin/role";

export default function RolePermissionsAssignmentPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const resolvedParameters = React.use(params);

  const { data } = useRequest({
    url: ENDPOINTS.ADMIN.ROLES.SHOW(resolvedParameters.id),
    queryKey: ["admin-specific-role", resolvedParameters.id],
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={ShieldCheck}
        title="Assign Permissions"
        description="Grant or revoke capabilities for this role to precisely control what members can see and do across the admin. Choose individual permissions or whole groups—changes take effect immediately."
        actions={
          <Button variant="outline" asChild>
            <Link
              href={PATHS.ADMIN.ROLES.LIST}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:!bg-gray-100 hover:!text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        }
      />

      <div className="w-full rounded-md border border-gray-200 p-5">
        <AssignPermissionsForm role={data?.data as Role} />
      </div>
    </div>
  );
}
