"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Key, SquarePen } from "lucide-react";
import Link from "next/link";

import RoleForm from "@/components/admin/roles/role-form";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Role } from "@/types/admin/role";
import {
  getModuleActions,
  getPermissionModuleCount,
  getPermissionModuleNames,
} from "@/utils/admin/permissions";

import RoleDeletionDialog from "./role-deletion-dialog";

export const rolesTableColumns: ColumnDef<Role>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Role</SortableHeader>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const description = row.original.description || "-";

      return (
        <div>
          <div className="text-foreground text-sm font-semibold">{name}</div>
          <div className="text-muted-foreground">{description}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "permissions",
    header: "Permissions",
    cell: ({ row }) => {
      const permissions = row.getValue("permissions") as Role["permissions"];
      const moduleCount = getPermissionModuleCount(permissions);

      if (moduleCount === 0) {
        return (
          <div className="flex items-center justify-start">
            <Badge
              variant="outline"
              className="text-muted-foreground border-dashed text-[13px] font-medium"
            >
              No permissions
            </Badge>
          </div>
        );
      }

      const moduleNames = getPermissionModuleNames(permissions);
      const previewModules = moduleNames.slice(0, 2);
      const remainingCount = moduleNames.length - previewModules.length;

      return (
        <div className="flex items-center gap-2">
          {previewModules.map((moduleKey) => {
            const actions = getModuleActions(permissions, moduleKey);
            return (
              <Tooltip key={moduleKey}>
                <TooltipTrigger asChild>
                  <Badge
                    variant="secondary"
                    className="max-w-[140px] cursor-help truncate text-[13px]"
                  >
                    {moduleKey}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" align="start">
                  <div className="text-xs">
                    <div className="font-semibold">{moduleKey}</div>
                    <div className="font-medium text-zinc-800">{actions.join(", ") || "-"}</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {remainingCount > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="cursor-help text-[13px]">
                  +{remainingCount} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" align="start" className="max-w-xs">
                <div className="space-y-2">
                  {moduleNames.slice(2).map((moduleKey) => {
                    const actions = getModuleActions(permissions, moduleKey);
                    return (
                      <div key={moduleKey} className="text-xs">
                        <div className="font-semibold">{moduleKey}</div>
                        <div className="font-medium text-zinc-800">{actions.join(", ") || "-"}</div>
                      </div>
                    );
                  })}
                </div>
              </TooltipContent>
            </Tooltip>
          ) : undefined}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const role = row.original;
      const hasPermissions = role.has_permissions;

      return (
        <div className="flex items-center space-x-2">
          {/* Permissions Management Button */}
          <Button
            asChild
            variant="default"
            size="sm"
            className={`flex items-center gap-1.5 text-[13px] font-medium text-white ${hasPermissions
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-gray-600 hover:bg-gray-700"
              }`}
          >
            <Link href="#">
              <Key className="h-2 w-2" />
              <span>{hasPermissions ? "Manage" : "Assign"}</span>
            </Link>
          </Button>

          {/* Edit Role Button */}
          <RoleForm
            mode="edit"
            defaultValues={role}
            trigger={
              <Button
                variant="default"
                size="sm"
                className="!bg-primary hover:!bg-primary/90 flex cursor-pointer items-center gap-1.5 text-[13px] font-medium"
              >
                <SquarePen className="h-2 w-2" />
                <span>Edit</span>
              </Button>
            }
          />

          {/* Delete Role Button */}
          <RoleDeletionDialog role={role} />
        </div>
      );
    },
  },
];
