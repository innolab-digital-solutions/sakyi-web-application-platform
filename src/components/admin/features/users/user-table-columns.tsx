"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
import { PATHS } from "@/config/paths";
import { User } from "@/types/admin/user";
import { cn } from "@/utils/shared/cn";

export const usersTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => {
      const user = row.original;
      const avatar = user.profile?.picture;
      const initial = user.name?.[0] ?? "?";

      return (
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
            {avatar ? (
              <Image src={avatar} alt={user.name} fill className="object-cover" />
            ) : (
              <span>{initial}</span>
            )}
          </div>
          <span className="text-sm font-semibold">{user.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column}>Email</SortableHeader>,
    cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-sm">{row.original.phone ?? "-"}</span>,
  },
  {
    accessorKey: "roles",
    header: ({ column }) => <SortableHeader column={column}>Roles</SortableHeader>,
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1">
          {row.original.roles?.length ? (
            row.original.roles.map((role) => (
              <Badge key={role.id} className="text-xs font-medium">
                {role.name}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-gray-400">No roles</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dob",
    header: ({ column }) => <SortableHeader column={column}>DOB</SortableHeader>,
    cell: ({ row }) => {
      return <span className="text-sm">{row.original.dob ?? "-"}</span>;
    },
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <SortableHeader column={column}>Gender</SortableHeader>,
    cell: ({ row }) => {
      return <span className="text-sm">{row.original.gender ?? "-"}</span>;
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => <SortableHeader column={column}>Address</SortableHeader>,
    cell: ({ row }) => {
      return <span className="text-sm">{row.original.address ?? "-"}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
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
              User Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              {(() => {
                const isEditable = Boolean(user.actions?.editable);
                const disabledReason = isEditable
                  ? undefined
                  : "You don't have permission to edit this user.";
                return (
                  <DisabledTooltip reason={disabledReason}>
                    <Button
                      asChild
                      variant="outline"
                      className="hover:!bg-accent/10 group hover:!text-accent hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium text-gray-700 shadow-none"
                      aria-label="Edit user"
                      disabled={!isEditable}
                    >
                      <Link href={PATHS.ADMIN.USERS.EDIT(user.id)}>
                        <SquarePen className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
                        <span>Edit User</span>
                      </Link>
                    </Button>
                  </DisabledTooltip>
                );
              })()}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
