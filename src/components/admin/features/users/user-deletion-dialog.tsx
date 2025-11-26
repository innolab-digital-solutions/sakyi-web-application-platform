import { Trash2, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { User, UserApiResponse } from "@/types/admin/user";

interface UserDeletionDialogProperties {
  user: User;
  className?: string;
}

export default function UserDeletionDialog({ user, className }: UserDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const request = useRequest();

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.USERS.DESTROY(user.id), {
      tanstack: {
        invalidateQueries: ["admin-users", "team-members-lookup"],
        mutationOptions: {
          onSuccess: () => {
            // Optimistic cache update - remove deleted user from the list
            request.queryCache.setQueryData<UserApiResponse>(
              ["admin-users"],
              (previous) => {
                if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                  return previous;
                }

                return {
                  ...previous,
                  data: previous.data.filter((u) => u.id !== user.id),
                } as UserApiResponse;
              },
              { all: true },
            );

            closeDeleteDialog();
            toast.success("User deleted successfully.");
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
        const isDisabled = isLoading;
        const disabledReason = isLoading ? "Deleting in progress. Please wait." : undefined;

        return (
          <DisabledTooltip reason={disabledReason}>
            <Button
              variant="outline"
              className={`hover:!bg-destructive/10 text-destructive group hover:text-destructive-900 hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium shadow-none ${className ?? ""}`}
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDisabled}
              type="button"
              aria-label="Delete user"
            >
              <Trash2 className="group-hover:text-destructive-900 text-destructive h-4 w-4 transition-colors duration-150" />
              <span>Delete</span>
            </Button>
          </DisabledTooltip>
        );
      })()}

      <ConfirmationDialog
        title="Delete User"
        description={`Permanently delete the user "${user.name}"? This action cannot be undone.`}
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
