import { Trash2, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { WorkoutCategory, WorkoutCategoryApiResponse } from "@/types/admin/workout-category";
import { cn } from "@/utils/shared/cn";

interface WorkoutCategoryDeletionDialogProperties {
  workoutCategory: WorkoutCategory;
  className?: string;
}

export default function WorkoutCategoryDeletionDialog({
  workoutCategory,
  className,
}: WorkoutCategoryDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const request = useRequest();

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.WORKOUT_CATEGORIES.DESTROY(workoutCategory.id), {
      tanstack: {
        invalidateQueries: ["admin-workout-categories"],
        mutationOptions: {
          onSuccess: () => {
            // Optimistic cache update - remove the deleted workout category from the list
            request.queryCache.setQueryData<WorkoutCategoryApiResponse>(
              ["admin-workout-categories"],
              (previous) => {
                if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                  return previous;
                }

                return {
                  ...previous,
                  data: previous.data.filter((wc) => wc.id !== workoutCategory.id),
                } as WorkoutCategoryApiResponse;
              },
              { all: true },
            );

            closeDeleteDialog();
            toast.success("Workout category deleted successfully.");
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
        const isDeletable = Boolean(workoutCategory.actions?.deletable);
        const isDisabled = isLoading || !isDeletable;
        let disabledReason: string | undefined;
        if (isLoading) {
          disabledReason = "Deleting in progress. Please wait.";
        } else if (!isDeletable) {
          disabledReason = "You don't have permission to delete this category.";
        }

        return (
          <DisabledTooltip reason={disabledReason}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-destructive/10 hover:text-destructive text-destructive flex items-center justify-center text-sm font-semibold hover:cursor-pointer",
                className,
              )}
              disabled={isDisabled}
              onClick={() => (isDeletable ? setShowDeleteDialog(true) : undefined)}
              aria-label="Delete workout category"
            >
              <Trash2 className="h-2 w-2" />
              <span>Delete</span>
            </Button>
          </DisabledTooltip>
        );
      })()}

      <ConfirmationDialog
        title="Delete Workout Category"
        description={`Permanently delete the workout category "${workoutCategory.name}"? This action cannot be undone.`}
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
