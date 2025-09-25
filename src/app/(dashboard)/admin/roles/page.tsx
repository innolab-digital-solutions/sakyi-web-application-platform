"use client";

import { Plus, ShieldCheck } from "lucide-react";
import React from "react";

import RoleFormDialog from "@/components/admin/roles/role-form-dialog";
import { Button } from "@/components/ui/button";

export default function RoleListPage() {
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
            <RoleFormDialog
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
              onSuccess={() => {
                // refresh roles list here when list is implemented
              }}
            />
          </div>
        </div>
      </div>

      <div>{/* Roles list will be rendered here */}</div>
    </>
  );
}
