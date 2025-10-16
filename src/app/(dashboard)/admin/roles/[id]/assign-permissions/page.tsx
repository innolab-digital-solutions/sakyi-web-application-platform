"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

import AssignPermissionsForm from "@/components/admin/features/roles/assign-permissions-form";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useRequest } from "@/hooks/use-request";
import { Role } from "@/types/admin/role";

interface RolePermissionsAssignmentPageProperties {
  params: Promise<{
    id: string;
  }>;
}

export default function RolePermissionsAssignmentPage({
  params,
}: RolePermissionsAssignmentPageProperties) {
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
        description="Assign or remove permissions for this role to control access and actions across all modules. Select specific capabilities or entire groups to define what users with this role can manage in the admin dashboard. Changes apply immediately."
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
