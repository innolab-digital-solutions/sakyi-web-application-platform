"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CalendarDays, Ellipsis, MapPinned, Mars, Phone, SquarePen, Venus } from "lucide-react";
import React from "react";

import UserDeletionDialog from "@/components/admin/features/users/user-deletion-dialog";
import UserForm from "@/components/admin/features/users/user-form";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { User } from "@/types/admin/user";

export const usersTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex items-center gap-2">
          <div>
            <Avatar>
              {user.picture ? (
                <AvatarImage src={user.picture} alt={user.name} />
              ) : (
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-foreground text-sm font-semibold">{user.name}</div>

            {user.role && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary flex items-center gap-1 font-semibold!"
              >
                {user.role}
              </Badge>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column}>Email</SortableHeader>,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-neutral-800">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.phone;

      return (
        <div className="flex items-center gap-2">
          {phone ? (
            <span className="text-sm font-medium text-neutral-800">{phone}</span>
          ) : (
            <Badge
              variant="outline"
              className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="ml-1">Not provided</span>
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => {
      const dob = row.original.dob;
      const formattedDob = dayjs(dob).isValid() ? dayjs(dob).format("DD-MMMM-YYYY") : dob;

      return (
        <div className="flex items-center gap-2">
          {formattedDob ? (
            <span className="text-sm font-medium text-neutral-800">{formattedDob}</span>
          ) : (
            <Badge
              variant="outline"
              className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="ml-1">Not provided</span>
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      return (
        <Badge
          variant="outline"
          className={`pointer-events-none flex items-center gap-1 border-none text-[13px] font-semibold! ${
            row.original.gender === "male"
              ? "bg-slate-100 text-slate-700"
              : "bg-pink-100 text-pink-700"
          }`}
        >
          {row.original.gender === "male" ? (
            <>
              <Mars className="h-3.5 w-3.5" />
              <span className="ml-1">Male</span>
            </>
          ) : (
            <>
              <Venus className="h-3.5 w-3.5" />
              <span className="ml-1">Female</span>
            </>
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.address;

      return (
        <div className="flex items-center gap-2">
          {address ? (
            <span className="text-sm font-medium text-neutral-800">{address}</span>
          ) : (
            <Badge
              variant="outline"
              className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
            >
              <MapPinned className="h-3.5 w-3.5" />
              <span className="ml-1">Not provided</span>
            </Badge>
          )}
        </div>
      );
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
              <UserForm
                mode="edit"
                defaultValues={{
                  ...user,
                  profile: user.profile ?? undefined,
                }}
                trigger={(() => {
                  const isEditable = Boolean(user.actions?.editable);
                  const disabledReason = isEditable
                    ? undefined
                    : "You don't have permission to edit this user.";
                  return (
                    <DisabledTooltip reason={disabledReason}>
                      <Button
                        variant="outline"
                        className="hover:!bg-accent/10 group hover:!text-accent hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium text-gray-700 shadow-none disabled:hover:!bg-transparent disabled:hover:!text-inherit"
                        aria-label="Edit user"
                        disabled={!isEditable}
                      >
                        <SquarePen className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
                        <span>Edit User</span>
                      </Button>
                    </DisabledTooltip>
                  );
                })()}
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <UserDeletionDialog user={user} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
