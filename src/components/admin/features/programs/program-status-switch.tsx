"use client";

import React from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Program, ProgramApiResponse } from "@/types/admin/program";

interface ProgramStatusSwitchProperties {
  program: Program;
}

export default function ProgramStatusSwitch({ program }: ProgramStatusSwitchProperties) {
  const request = useRequest();

  const isDraft = program.status === "draft";
  const isPublished = program.status === "published";
  const canToggle = isDraft || isPublished;

  const handleToggle = (checked: boolean) => {
    if (!canToggle) return;

    const newStatus = checked ? "published" : "draft";

    request.patch(
      ENDPOINTS.ADMIN.PROGRAMS.CHANGE_STATUS(program.id),
      { status: newStatus },
      {
        tanstack: {
          invalidateQueries: ["admin-programs"],
          mutationOptions: {
            onSuccess: () => {
              // Optimistic cache update
              request.queryCache.setQueryData<ProgramApiResponse>(
                ["admin-programs"],
                (previous) => {
                  if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                    return previous;
                  }

                  return {
                    ...previous,
                    data: previous.data.map((p) =>
                      p.id === program.id
                        ? {
                            ...p,
                            status: newStatus,
                            published_at:
                              newStatus === "published" ? new Date().toISOString() : undefined,
                          }
                        : p,
                    ),
                  } as ProgramApiResponse;
                },
                { all: true },
              );

              // Update the specific program cache if available
              request.queryCache.setQueryData<ProgramApiResponse>(
                ["admin-program", String(program.id)],
                (previous) => {
                  if (!previous || previous.status !== "success") return previous;
                  return {
                    ...previous,
                    data: {
                      ...previous.data,
                      status: newStatus,
                      published_at:
                        newStatus === "published" ? new Date().toISOString() : undefined,
                    },
                  } as ProgramApiResponse;
                },
                { all: true },
              );

              toast.success(
                `Program ${newStatus === "published" ? "published" : "moved to draft"} successfully.`,
              );
            },
            onError: (error) => {
              toast.error(error.message);
            },
          },
        },
      },
    );
  };

  if (!canToggle) {
    return;
  }

  const tooltipText = isPublished
    ? "Click to move program to draft status"
    : "Click to publish program";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Switch
            checked={isPublished}
            onCheckedChange={handleToggle}
            disabled={request.loading}
            aria-label={`Toggle program ${program.title} to ${isPublished ? "draft" : "published"}`}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-popover text-popover-foreground border-border max-w-xs rounded-md border px-3 py-2 shadow-lg">
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
