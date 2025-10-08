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
    queryKey: ["role", resolvedParameters.id],
    requireAuth: true,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <PageHeader
        icon={ShieldCheck}
        title="Assign Permissions"
        description="Assign permissions to a role to control administrative access and user capabilities throughout the dashboard."
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
    </>
  );
}
