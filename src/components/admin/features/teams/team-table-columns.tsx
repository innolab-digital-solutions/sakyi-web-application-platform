"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { SquarePen } from "lucide-react";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Button } from "@/components/ui/button";
import { Team } from "@/types/admin/team";

import { ImagePreview } from "../../shared/image-preview";
import TeamDeletionDialog from "./team-deletion-dialog";
import TeamForm from "./team-form";

export const teamsTableColumns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => {
      const name = row.original.name ?? "-";
      return <span className="text-sm font-medium">{name}</span>;
    },
  },
  {
    accessorKey: "description",
    header: () => <span>Description</span>,
    cell: ({ row }) => {
      const description = row.original.description || "-";
      return (
        <span className="text-muted-foreground line-clamp-2 max-w-[320px] text-sm">
          {description}
        </span>
      );
    },
  },
  {
    accessorKey: "users",
    header: () => <span>Members</span>,
    cell: ({ row }) => {
      const users = row.original.users ?? [];

      return (
        <div className="flex items-center -space-x-1.5">
          {users.slice(0, 5).map((user, index) => (
            <div
              key={user.id}
              className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200 text-sm font-semibold text-gray-600 shadow-lg"
              style={{ zIndex: index }}
            >
              <ImagePreview src={user.picture ?? "/default-avatar.png"} alt={user.name} />
            </div>
          ))}

          {users.length > 5 && (
            <div
              className="relative -ml-1.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-500 shadow-lg"
              style={{ zIndex: users.length }} // higher than the last avatar
            >
              +{users.length - 5}
            </div>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "created_at",
    header: () => <span>Created</span>,
    cell: ({ row }) => {
      const date = dayjs(row.original.created_at).format("DD-MMMM-YYYY");
      return <span className="text-sm">{date}</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const team = row.original;
      const isEditable = Boolean(team.actions?.editable);
      const disabledReason = isEditable
        ? undefined
        : "You don't have permission to edit this workout.";
      return (
        <div className="flex items-center space-x-0.5">
          <TeamForm
            mode="edit"
            defaultValues={team}
            trigger={(() => {
              return (
                <DisabledTooltip reason={disabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10 hover:text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
                    disabled={!isEditable}
                  >
                    <SquarePen className="h-2 w-2" />
                    <span>Edit</span>
                  </Button>
                </DisabledTooltip>
              );
            })()}
          />

          <TeamDeletionDialog team={team} />
        </div>
      );
    },
  },
];
