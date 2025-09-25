"use client";

import { Plus, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import RoleForm from "@/components/admin/roles/role-form";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { RoleApiResponse } from "@/types/admin/role";

export default function RoleListPage() {
  const [roles, setRoles] = useState<RoleApiResponse["data"]>([]);
  const request = useRequest();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;
    request.get<RoleApiResponse>(ENDPOINTS.ADMIN.ROLES.INDEX, undefined, {
      onSuccess: (response) => {
        setRoles(response.data || []);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-foreground mb-1 flex items-center gap-2 text-lg font-bold">
              <ShieldCheck className="h-5 w-5" />
              Roles & Permissions
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Manage roles and permissions for your application.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row">
            <RoleForm
              mode="create"
              trigger={
                <Button
                  variant="default"
                  className="flex w-full items-center gap-2 text-sm font-medium sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Role</span>
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Tanstack Table  */}
      <div>
        <h1>Roles</h1>
        {roles.map((role) => (
          <div key={role.id}>{role.name}</div>
        ))}
      </div>
    </>
  );
}
