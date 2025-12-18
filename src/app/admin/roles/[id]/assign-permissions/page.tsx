"use client";

import { ArrowLeft } from "lucide-react";
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
        title="Assign Permissions"
        description="Choose exactly what this role can see and do in the admin. Turn on only the permissions they need so access stays least‑privilege and easy to audit."
        actions={
          <Button variant="outline" asChild>
            <Link
              href={PATHS.ADMIN.ROLES.LIST}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:bg-gray-100! hover:text-gray-800!"
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
