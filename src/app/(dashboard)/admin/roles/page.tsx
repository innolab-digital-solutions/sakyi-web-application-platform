/* eslint-disable unicorn/no-null */
"use client";

import { ClipboardCheck, Plus } from "lucide-react";
import { useState } from "react";

import RoleForm from "@/components/admin/roles/form";
import { RolesTable } from "@/components/admin/roles/table";
import PageHeader from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { RolesResponse } from "@/types/admin/role";

// Dummy paginated response data for testing
const dummyRolesResponse: RolesResponse = {
  status: "success",
  message: "Roles retrieved successfully",
  data: [
    {
      id: 1,
      name: "Super Administrator",
      description:
        "Full system access with all permissions. Can manage users, roles, and system settings.",
      permissions: [
        {
          users: {
            create: "Create new users",
            read: "View user information",
            update: "Update user details",
            delete: "Delete users",
          },
          roles: {
            create: "Create new roles",
            read: "View role information",
            update: "Update role permissions",
            delete: "Delete roles",
          },
          programs: {
            create: "Create wellness programs",
            read: "View all programs",
            update: "Update program details",
            delete: "Delete programs",
          },
          reports: {
            read: "View all reports",
            export: "Export report data",
          },
        },
      ],
      created_at: "2024-01-15T10:30:00Z",
      updated_at: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      name: "Program Manager",
      description:
        "Manages wellness programs and client enrollments. Can view reports and manage program content.",
      permissions: [
        {
          programs: {
            create: "Create new programs",
            read: "View all programs",
            update: "Update program details",
            delete: "Delete own programs",
          },
          clients: {
            read: "View client information",
            update: "Update client program status",
          },
          reports: {
            read: "View program reports",
            export: "Export program data",
          },
        },
      ],
      created_at: "2024-01-20T14:15:00Z",
      updated_at: "2024-01-25T09:45:00Z",
    },
    {
      id: 3,
      name: "Health Coach",
      description:
        "Provides direct client support and tracks wellness progress. Limited administrative access.",
      permissions: [
        {
          clients: {
            read: "View assigned clients",
            update: "Update client progress",
          },
          programs: {
            read: "View program details",
          },
          reports: {
            read: "View client progress reports",
          },
        },
      ],
      created_at: "2024-02-01T08:00:00Z",
      updated_at: "2024-02-01T08:00:00Z",
    },
    {
      id: 4,
      name: "Content Creator",
      description: "Creates and manages wellness content, articles, and educational materials.",
      permissions: [
        {
          content: {
            create: "Create new content",
            read: "View all content",
            update: "Update content",
            delete: "Delete own content",
          },
          programs: {
            read: "View program content",
            update: "Update program content",
          },
        },
      ],
      created_at: "2024-02-10T11:20:00Z",
      updated_at: "2024-02-15T16:30:00Z",
    },
    {
      id: 5,
      name: "Viewer",
      description:
        "Read-only access to view system information and reports. No modification permissions.",
      permissions: [
        {
          users: {
            read: "View user information",
          },
          programs: {
            read: "View program details",
          },
          reports: {
            read: "View reports",
          },
        },
      ],
      created_at: "2024-02-20T13:45:00Z",
      updated_at: "2024-02-20T13:45:00Z",
    },
  ],
  meta: {
    pagination: {
      current_page: 1,
      per_page: 10,
      total: 5,
      last_page: 1,
      from: 1,
      to: 5,
      has_more_pages: false,
      path: "/admin/roles",
      next_page_url: null,
      prev_page_url: null,
    },
  },
};

export default function RoleListPage() {
  const [rolesResponse] = useState<RolesResponse>(dummyRolesResponse);
  const roles = rolesResponse.data;

  return (
    <>
      <PageHeader
        icon={ClipboardCheck}
        title="Roles & Permissions"
        description=" Manage roles and permissions for your application."
        actions={
          <>
            <RoleForm
              mode="create"
              trigger={
                <Button
                  variant="default"
                  className="flex h-10 w-full cursor-pointer items-center gap-2 text-sm font-medium sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Role</span>
                </Button>
              }
            />
          </>
        }
      />

      <RolesTable data={roles} isLoading={false} />
    </>
  );
}
