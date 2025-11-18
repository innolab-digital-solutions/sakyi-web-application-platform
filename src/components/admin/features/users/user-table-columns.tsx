"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { SquarePen } from "lucide-react";
import Link from "next/link";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import { User } from "@/types/admin/user";

import { ImagePreview } from "../../shared/image-preview";
import UserDeletionDialog from "./user-deletion-dialog";

export const usersTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => {
      const user = row.original;
      const avatar = user.picture;
      const initial = user.name?.[0] ?? "?";

      return (
        <div className="flex items-center gap-2">
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
            {avatar ? <ImagePreview src={avatar} type="Avatar" /> : <span>{initial}</span>}
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
    header: "Role",
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1">
          {row.original.role ? (
            <Badge className="font-medium">{row.original.role}</Badge>
          ) : (
            <span className="text-sm text-gray-400">No Role</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dob",
    header: "DOB",
    cell: ({ row }) => {
      const dob = row.original.dob;
      const formattedDob = dayjs(dob).isValid() ? dayjs(dob).format("DD-MMMM-YYYY") : dob;

      return <span className="text-sm">{formattedDob ?? "-"}</span>;
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.original.gender;
      const formattedGender = gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : gender;
      return <span className="text-sm">{formattedGender ?? "-"}</span>;
    },
  },
  {
    accessorKey: "address",
    header: "Address",
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
      const isEditable = Boolean(user.actions?.editable);
      const disabledReason = isEditable
        ? undefined
        : "You don't have permission to edit this workout.";

      return (
        <div className="flex items-center space-x-0.5">
          <DisabledTooltip reason={disabledReason}>
            <Button variant="ghost" size="sm" asChild disabled={!isEditable}>
              <Link
                href={PATHS.ADMIN.USERS.EDIT(user.id)}
                className="hover:bg-accent/10 hover:text-accent text-accent flex cursor-pointer items-center justify-center text-sm font-semibold disabled:hover:!bg-transparent disabled:hover:!text-inherit"
              >
                <SquarePen className="h-2 w-2" />
                <span>Edit</span>
              </Link>
            </Button>
          </DisabledTooltip>

          <UserDeletionDialog user={user} />
        </div>
      );
    },
  },
];
