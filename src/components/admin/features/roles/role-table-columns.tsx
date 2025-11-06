"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, FileKey, SquarePen } from "lucide-react";
import Link from "next/link";

import RoleDeletionDialog from "@/components/admin/features/roles/role-deletion-dialog";
import RoleForm from "@/components/admin/features/roles/role-form";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PATHS } from "@/config/paths";
import { Role } from "@/types/admin/role";
import {
  getModuleActions,
  getPermissionModuleCount,
  getPermissionModuleNames,
} from "@/utils/admin/permissions";

import DescriptionCollapse from "../../shared/description-collapse";

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
          <DescriptionCollapse description={description ?? undefined} />
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
              className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
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
                    className="bg-primary/15 text-primary flex max-w-[140px] cursor-help items-center gap-1 truncate text-[13px] !font-semibold"
                  >
                    {moduleKey}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="start"
                  className="bg-popover text-popover-foreground border-border rounded-md border px-3 py-2 shadow-lg"
                >
                  <div className="text-xs">
                    <div className="text-primary font-semibold">{moduleKey}</div>
                    <div className="text-muted-foreground font-medium">
                      {actions.join(", ") || "-"}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {remainingCount > 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="bg-muted/60 text-muted-foreground cursor-help border-dashed text-[13px] !font-semibold"
                >
                  +{remainingCount} more
                </Badge>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="start"
                className="bg-popover text-popover-foreground border-border max-w-xs rounded-md border px-3 py-2 shadow-lg"
              >
                <div className="space-y-2">
                  {moduleNames.slice(2).map((moduleKey) => {
                    const actions = getModuleActions(permissions, moduleKey);
                    return (
                      <div key={moduleKey} className="text-xs">
                        <div className="text-primary font-semibold">{moduleKey}</div>
                        <div className="text-muted-foreground font-medium">
                          {actions.join(", ") || "-"}
                        </div>
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

      return role.name === "Super Admin" ? (
        <></>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open actions"
              className="hover:!text-foreground ml-auto size-8 cursor-pointer items-center justify-center hover:!bg-gray-100"
            >
              <Ellipsis className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="p-3.5">
            <DropdownMenuLabel className="text-muted-foreground text-[13px] font-semibold">
              Role Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              {(() => {
                const isEditable = Boolean(role.actions?.editable);
                const disabledReason = isEditable
                  ? undefined
                  : "You don't have permission to assign permissions for this role.";
                return (
                  <DisabledTooltip reason={disabledReason}>
                    <Button
                      asChild
                      variant="outline"
                      className="hover:!bg-accent/10 hover:!text-accent group flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium text-gray-700 shadow-none hover:!ring-0"
                      aria-label={hasPermissions ? "Manage permissions" : "Assign permissions"}
                      disabled={!isEditable}
                    >
                      <Link
                        href={PATHS.ADMIN.ROLES.ASSIGN_PERMISSIONS(role.id)}
                        aria-disabled={!isEditable}
                        tabIndex={isEditable ? 0 : -1}
                      >
                        <FileKey className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
                        <span>Assign Permissions</span>
                      </Link>
                    </Button>
                  </DisabledTooltip>
                );
              })()}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <RoleForm
                mode="edit"
                defaultValues={role}
                trigger={(() => {
                  const isEditable = Boolean(role.actions?.editable);
                  const disabledReason = isEditable
                    ? undefined
                    : "You don't have permission to edit this role.";
                  return (
                    <DisabledTooltip reason={disabledReason}>
                      <Button
                        variant="outline"
                        className="hover:!bg-accent/10 group hover:!text-accent hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium text-gray-700 shadow-none disabled:hover:!bg-transparent disabled:hover:!text-inherit"
                        aria-label="Edit role"
                        disabled={!isEditable}
                      >
                        <SquarePen className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
                        <span>Edit Role</span>
                      </Button>
                    </DisabledTooltip>
                  );
                })()}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <RoleDeletionDialog role={role} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
