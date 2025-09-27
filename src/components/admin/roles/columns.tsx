/* eslint-disable security/detect-object-injection */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Trash } from "lucide-react";

import RoleForm from "@/components/admin/roles/form";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Role } from "@/types/admin/role";

export const rolesColumns: ColumnDef<Role>[] = [
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
      const raw = row.getValue("permissions") as Role["permissions"];
      const permissionMaps = Array.isArray(raw) ? raw : raw ? [raw] : [];

      const combinedModules: Record<string, Record<string, string>> = {};
      for (const map of permissionMaps) {
        for (const [moduleKey, actions] of Object.entries(map)) {
          const existingActions = combinedModules[moduleKey] ?? {};
          combinedModules[moduleKey] = { ...existingActions, ...actions };
        }
      }

      const moduleCount = Object.keys(combinedModules).length;

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

      const moduleNames = Object.keys(combinedModules);
      const previewModules = moduleNames.slice(0, 2);
      const remainingCount = moduleNames.length - previewModules.length;

      return (
        <div className="flex items-center gap-2">
          {previewModules.map((moduleKey) => {
            const actions = Object.keys(combinedModules[moduleKey] ?? {});
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
                    const actions = Object.keys(combinedModules[moduleKey] ?? {});
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

      return (
        <div className="flex items-center space-x-5">
          <RoleForm
            mode="edit"
            defaultValues={{
              id: role.id,
              name: role.name,
              description: role.description,
            }}
            trigger={
              <Button
                variant="link"
                className="text-primary hover:text-primary/80 flex cursor-pointer items-center justify-center !p-0 text-sm font-semibold hover:underline"
              >
                <SquarePen className="h-3 w-3" />
                <span>Edit</span>
              </Button>
            }
          />

          <Button
            variant="link"
            className="text-destructive hover:text-destructive/80 flex cursor-pointer items-center justify-center !p-0 text-sm font-semibold hover:underline"
          >
            <Trash className="h-3 w-3" />
            <span>Delete</span>
          </Button>
        </div>
      );
    },
  },
];
