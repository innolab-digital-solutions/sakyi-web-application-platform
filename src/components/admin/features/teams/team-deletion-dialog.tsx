import { Trash2, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Team, TeamApiResponse } from "@/types/admin/team";
import { cn } from "@/utils/shared/cn";

interface TeamDeletionDialogProperties {
  team: Team;
  className?: string;
}

export default function TeamDeletionDialog({ team, className }: TeamDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const request = useRequest();

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.TEAMS.DESTROY(team.id), {
      tanstack: {
        invalidateQueries: ["admin-teams"],
        mutationOptions: {
          onSuccess: () => {
            // Optimistic cache update - remove deleted team
            request.queryCache.setQueryData<TeamApiResponse>(
              ["admin-teams"],
              (previous) => {
                if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                  return previous;
                }

                return {
                  ...previous,
                  data: previous.data.filter((t) => t.id !== team.id),
                } as TeamApiResponse;
              },
              { all: true },
            );

            closeDeleteDialog();
            toast.success("Team deleted successfully.");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      },
    });
  };

  return (
    <>
      {(() => {
        const isLoading = request.loading;
        const isDeletable = Boolean(team.actions?.deletable);
        const isDisabled = isLoading || !isDeletable;

        let disabledReason: string | undefined;

        if (isLoading) {
          disabledReason = "Deleting in progress. Please wait.";
        } else if (!isDeletable) {
          disabledReason = "You don't have permission to delete this team.";
        }

        return (
          <DisabledTooltip reason={disabledReason}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-destructive/10 hover:text-destructive text-destructive flex cursor-pointer items-center justify-center text-sm font-semibold disabled:!pointer-events-auto disabled:cursor-help disabled:bg-transparent",
                className,
              )}
              disabled={isDisabled}
              onClick={() => (isDeletable ? setShowDeleteDialog(true) : undefined)}
              aria-label="Delete team"
            >
              <Trash2 className="h-2 w-2" />
              <span>Delete</span>
            </Button>
          </DisabledTooltip>
        );
      })()}

      <ConfirmationDialog
        title="Delete Team"
        description={`Permanently delete the team "${team.name}"? This action cannot be undone.`}
        icon={TriangleAlert}
        variant="destructive"
        confirmText="Yes, Delete It"
        cancelText="No, Keep It"
        isOpen={showDeleteDialog}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isLoading={request.loading}
      />
    </>
  );
}
