"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { CalendarDays, MapPinned, Mars, Phone, SquarePen, Venus } from "lucide-react";
import React from "react";

import UserDeletionDialog from "@/components/admin/features/users/user-deletion-dialog";
import UserForm from "@/components/admin/features/users/user-form";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
                className="bg-primary/10 text-primary flex items-center gap-1 !font-semibold"
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
          className={`pointer-events-none flex items-center gap-1 border-none text-[13px] !font-semibold ${
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
      const isEditable = Boolean(user.actions?.editable);
      const disabledReason = isEditable
        ? undefined
        : "You don't have permission to edit this workout.";

      return (
        <div className="flex items-center space-x-0.5">
          <UserForm
            mode="edit"
            defaultValues={{
              ...user,
              profile: user.profile ?? undefined,
            }}
            trigger={(() => {
              return (
                <DisabledTooltip reason={disabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10 hover:text-accent flex cursor-pointer items-center justify-center text-sm font-semibold disabled:hover:!bg-transparent disabled:hover:!text-inherit"
                    disabled={!isEditable}
                  >
                    <SquarePen className="h-2 w-2" />
                    <span>Edit</span>
                  </Button>
                </DisabledTooltip>
              );
            })()}
          />

          <UserDeletionDialog user={user} />
        </div>
      );
    },
  },
];
