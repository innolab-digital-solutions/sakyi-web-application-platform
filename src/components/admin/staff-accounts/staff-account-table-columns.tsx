"use client";

import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Ellipsis } from "lucide-react";
import React from "react";

import SortableHeader from "@/components/shared/table/sortable-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StaffAccount } from "@/types/admin/staff-account";
import { cn } from "@/utils/shared/cn";

export const staffAccountTableColumns: ColumnDef<StaffAccount>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Staff</SortableHeader>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const username = row.original.username ?? "";
      const avatar = row.original.avatar;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={avatar} />
            <AvatarFallback className="from-primary via-accent to-secondary text-primary-foreground bg-gradient-to-tr">
              {name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="text-foreground text-sm font-semibold">{name}</div>
            <span className="text-primary cursor-pointer">@{username || "-"}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => {
      const email = row.getValue("email") as string | null;
      return email ? <span className="truncate">{email}</span> : "-";
    },
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string | null;
      return phone ? <span>{phone}</span> : "-";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string | null;
      if (!status) return "-";
      const badgeClass =
        status === "active"
          ? " border-green-200 bg-green-50 text-green-700"
          : " border-red-200 bg-red-50  text-red-700";
      return (
        <Badge
          variant="outline"
          className={cn(
            badgeClass,
            "pointer-events-none ml-1 px-2 py-0.5 text-[13px] font-semibold capitalize",
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => {
      const dob = row.getValue("dob") as string | null;
      const formatted = dayjs(dob).format("DD-MMMM-YYYY");
      return dob ? <span className="text-foreground text-sm">{formatted}</span> : "-";
    },
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string | null;
      return gender ? <span className="capitalize">{gender}</span> : "-";
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => {
      const address = row.getValue("address") as string | null;
      return address ? <span className="max-w-[180px] truncate">{address}</span> : "-";
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: () => {
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="More actions"
            className="hover:!text-foreground size-8 cursor-pointer items-center justify-center hover:!bg-gray-100"
          >
            <Ellipsis className="h-5 w-5" />
          </Button>
        </div>
      );
    },
  },
];
