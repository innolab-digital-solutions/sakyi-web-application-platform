import { Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { WorkoutCategory } from "@/types/admin/workout-category";
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
      requireAuth: true,
      tanstack: {
        invalidateQueries: ["admin-workout-categories"],
        mutationOptions: {
          onSuccess: () => {
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
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "hover:bg-destructive/10 hover:text-destructive text-destructive flex cursor-pointer items-center justify-center text-sm font-semibold",
          className,
        )}
        disabled={request.loading}
        onClick={() => setShowDeleteDialog(true)}
        aria-label="Delete workout category"
      >
        <Trash className="h-2 w-2" />
        <span>Delete</span>
      </Button>

      <ConfirmationDialog
        title="Delete Workout Category Confirmation"
        description="Are you sure you want to delete this workout category? This action cannot be undone."
        icon={Trash}
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
