"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  CalendarDays,
  Copy as CopyIcon,
  Ellipsis,
  MapPinned,
  Mars,
  Phone,
  SquarePen,
  UserRound,
  Venus,
} from "lucide-react";
import React, { useState } from "react";

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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { User } from "@/types/admin/user";

function CopyPublicId({ publicId }: { publicId: string | undefined }) {
  const [copied, setCopied] = useState(false);

  if (!publicId) return;

  return (
    <TooltipProvider>
      <Tooltip open={copied ? true : undefined} onOpenChange={(o) => !o && setCopied(false)}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-muted-foreground hover:text-primary ml-1 cursor-pointer transition"
            aria-label="Copy public id"
            onClick={async (event) => {
              event.stopPropagation();
              if (publicId) {
                await navigator.clipboard.writeText(publicId);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }
            }}
          >
            <CopyIcon size={16} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-popover text-popover-foreground border-border rounded-md border px-3 py-2 shadow-lg">
          {copied ? "Copied!" : "Copy"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const usersTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "public_id",
    header: ({ column }) => <SortableHeader column={column}>Public ID</SortableHeader>,
    cell: ({ row }) => (
      <div className="text-foreground flex items-center gap-1 text-[13px] font-semibold">
        {row.original.public_id ?? "-"}
        <CopyPublicId publicId={row.original.public_id ?? undefined} />
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => {
      const user = row.original;
      const profile = user.profile;

      return (
        <div className="flex items-center gap-2">
          <div>
            <Avatar>
              <AvatarImage src={profile?.picture ?? ""} alt={profile?.name ?? "User avatar"} />
              <AvatarFallback>{profile?.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-foreground text-sm font-semibold">
              {profile?.name ?? "Unknown user"}
            </div>

            {profile?.role && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary flex items-center gap-1 font-semibold!"
              >
                {profile.role}
              </Badge>
            )}
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <SortableHeader column={column}>Email</SortableHeader>,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-neutral-800">
        {row.original.profile?.email ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.original.profile?.phone;

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
      const dob = row.original.profile?.dob;
      const formattedDob =
        dob && dayjs(dob).isValid() ? dayjs(dob).format("DD-MMMM-YYYY") : (dob ?? "");

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
      const gender = row.original.profile?.gender;
      if (!gender) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
          >
            <span className="ml-1">Not provided</span>
          </Badge>
        );
      }

      const label = gender === "male" ? "Male" : gender === "female" ? "Female" : (gender ?? "");

      return (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-neutral-800">
          {gender === "male" && <Mars className="h-3.5 w-3.5" />}
          {gender === "female" && <Venus className="h-3.5 w-3.5" />}
          {gender !== "male" && gender !== "female" && <UserRound className="h-3.5 w-3.5" />}
          <span className="capitalize">{label}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.original.profile?.address;

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
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.profile?.created_at;
      const formattedCreatedAt =
        createdAt && dayjs(createdAt).isValid()
          ? dayjs(createdAt).format("DD-MMMM-YYYY ( hh:mm ) A")
          : (createdAt ?? "");

      return (
        <div className="flex items-center gap-2">
          {formattedCreatedAt ? (
            <span className="text-sm font-medium text-neutral-800">{formattedCreatedAt}</span>
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
              className="hover:text-foreground! ml-auto size-8 cursor-pointer items-center justify-center hover:bg-gray-100!"
            >
              <Ellipsis className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="min-w-[180px] p-3">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <UserForm
                mode="edit"
                defaultValues={{
                  ...user,
                  profile: user.profile ?? undefined,
                }}
                trigger={(() => {
                  const editAllowed = Boolean(user.actions?.edit?.allowed);
                  const reasons = user.actions?.edit?.reasons ?? [];
                  const disabledReason =
                    editAllowed || reasons.length === 0
                      ? undefined
                      : reasons.join(" ").trim() || undefined;
                  return (
                    <DisabledTooltip reason={disabledReason}>
                      <Button
                        variant="outline"
                        className="hover:bg-accent/10! group hover:text-accent! hover:ring-none! flex w-full cursor-pointer! items-center justify-start gap-1.5 border-none! text-sm font-medium text-gray-700 shadow-none disabled:hover:bg-transparent! disabled:hover:text-inherit!"
                        aria-label="Edit user"
                        disabled={!editAllowed}
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
