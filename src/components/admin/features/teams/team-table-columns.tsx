"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, UserX } from "lucide-react";
import React from "react";

import TeamDeletionDialog from "@/components/admin/features/teams/team-deletion-dialog";
import TeamForm from "@/components/admin/features/teams/team-form";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Team } from "@/types/admin/team";

export const teamsTableColumns: ColumnDef<Team>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Team</SortableHeader>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const description = row.original.description || "-";

      return (
        <div>
          <div className="text-foreground text-sm font-semibold">{name}</div>
          <div className="text-muted-foreground line-clamp-2 max-w-full wrap-break-word whitespace-pre-line">
            {description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "members",
    header: () => <span>Members</span>,
    cell: ({ row }) => {
      const members = row.original.members ?? [];

      if (members.length === 0) {
        return (
          <div className="flex items-center justify-start">
            <Badge
              variant="outline"
              className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
            >
              <UserX className="h-3.5 w-3.5" />
              <span className="ml-1">No members</span>
            </Badge>
          </div>
        );
      }

      return (
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((member, index) => {
              const initial = member.name?.[0] ?? "?";
              return (
                <div key={member.name + index} className="relative z-0">
                  <span className="sr-only">{member.name}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="border-muted size-8 cursor-pointer border ring-2 ring-white">
                        <AvatarImage src={member.picture ?? undefined} alt={member.name} />
                        <AvatarFallback>{initial}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      align="center"
                      className="bg-popover text-popover-foreground border-border rounded-md border px-3 py-2 shadow-lg"
                    >
                      <div className="flex min-w-[130px] flex-col gap-0.5">
                        <span className="text-foreground text-xs font-semibold">{member.name}</span>
                        {member.role && (
                          <span className="text-primary text-xs font-medium">{member.role}</span>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}
            {members.length > 5 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="bg-muted text-muted-foreground border-muted ml-1 flex size-8 cursor-pointer items-center justify-center rounded-full border border-dashed text-xs font-semibold">
                    +{members.length - 5}
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  className="bg-popover text-popover-foreground border-border rounded-md border px-3 py-2 shadow-lg"
                >
                  <div className="text-xs font-medium">
                    {members.slice(5).map((member, index) => (
                      <div key={member.name + index} className="mb-1 last:mb-0">
                        <span className="text-foreground text-xs font-semibold">{member.name}</span>
                        {member.role && (
                          <span className="text-primary ml-1 text-xs font-medium">
                            ({member.role})
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
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
      const team = row.original;

      const editAllowed = Boolean(team.actions?.edit?.allowed);
      const editReasons = team.actions?.edit?.reasons ?? [];
      const editDisabledReason =
        editAllowed || editReasons.length === 0 ? undefined : editReasons[0]?.trim() || undefined;

      return (
        <div className="flex items-center space-x-0.5">
          <TeamForm
            mode="edit"
            defaultValues={team}
            trigger={(() => {
              return (
                <DisabledTooltip reason={editDisabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10 hover:text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
                    disabled={!editAllowed}
                    aria-label="Edit team"
                  >
                    <SquarePen className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
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
