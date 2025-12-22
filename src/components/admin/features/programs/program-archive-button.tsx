"use client";

import { Archive, Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Program, ProgramApiResponse } from "@/types/admin/program";
import { ApiResponse } from "@/types/shared/api";

interface ProgramArchiveButtonProperties {
  program: Program;
  className?: string;
}

export default function ProgramArchiveButton({
  program,
  className,
}: ProgramArchiveButtonProperties) {
  const request = useRequest();

  const isPublished = program.status === "published";
  const isArchived = program.status === "archived";
  const isDraft = program.status === "draft";
  const canArchive = isPublished || isArchived;
  const isLoading = request.loading;

  const handleArchiveToggle = () => {
    if (!canArchive || isLoading) return;

    const newStatus = isPublished ? "archived" : "published";

    request.patch(
      ENDPOINTS.ADMIN.PROGRAMS.STATUS(program.id),
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
                      p.id === program.id ? { ...p, status: newStatus } : p,
                    ),
                  } as ProgramApiResponse;
                },
                { all: true },
              );

              // Update the specific program cache if available
              request.queryCache.setQueryData<ApiResponse<Program> | undefined>(
                ["admin-program", String(program.id)],
                (previous: ApiResponse<Program> | undefined) => {
                  if (!previous || previous.status !== "success") {
                    return previous;
                  }
                  return {
                    ...previous,
                    data: { ...previous.data, status: newStatus },
                  } as ApiResponse<Program>;
                },
                { all: true },
              );

              toast.success(
                `Program ${newStatus === "archived" ? "archived" : "restored to published"} successfully.`,
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

  const disabledReason = isDraft
    ? "Draft programs cannot be archived. Publish the program first to enable archiving."
    : undefined;

  return (
    <DisabledTooltip reason={disabledReason}>
      <Button
        variant="outline"
        className={`hover:bg-accent/10! group hover:text-accent! hover:ring-none! flex w-full cursor-pointer! items-center justify-start gap-1.5 border-none! text-sm font-medium text-gray-700 shadow-none disabled:hover:bg-transparent! disabled:hover:text-inherit! ${className ?? ""}`}
        onClick={handleArchiveToggle}
        disabled={!canArchive || isLoading}
        aria-label={isArchived ? "Restore to published" : "Move to archive"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin transition-colors duration-150" />
        ) : (
          <Archive className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
        )}
        <span>{isArchived ? "Restore to Published" : "Move to Archive"}</span>
      </Button>
    </DisabledTooltip>
  );
}
