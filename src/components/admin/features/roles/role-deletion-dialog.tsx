import { Trash2, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Role, RoleApiResponse } from "@/types/admin/role";

interface RoleDeletionDialogProperties {
  role: Role;
  className?: string;
}

export default function RoleDeletionDialog({ role, className }: RoleDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const request = useRequest();

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.ROLES.DESTROY(role.id), {
      tanstack: {
        invalidateQueries: ["admin-roles"],
        mutationOptions: {
          onSuccess: () => {
            // Optimistic cache update - remove the deleted role from the list
            request.queryCache.setQueryData<RoleApiResponse>(
              ["admin-roles"],
              (previous) => {
                if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                  return previous;
                }

                return {
                  ...previous,
                  data: previous.data.filter((r) => r.id !== role.id),
                } as RoleApiResponse;
              },
              { all: true },
            );

            closeDeleteDialog();
            toast.success("Role deleted successfully.");
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
        const deleteAllowed = Boolean(role.actions?.delete?.allowed);
        const deleteReasons = role.actions?.delete?.reasons ?? [];
        const isDisabled = isLoading || !deleteAllowed;

        let disabledReason: string | undefined;
        if (isLoading) {
          disabledReason = "Deleting in progress. Please wait.";
        } else if (!deleteAllowed && deleteReasons.length > 0) {
          disabledReason = deleteReasons[0]?.trim() || undefined;
        }

        const hasReason = Boolean(disabledReason);
        const tooltipCursorClass = isDisabled && hasReason ? "cursor-help" : undefined;

        return (
          <DisabledTooltip reason={disabledReason} className={tooltipCursorClass}>
            <Button
              variant="outline"
              className={`hover:bg-destructive/10 text-destructive group hover:text-destructive-900 hover:ring-none! flex w-full cursor-pointer! items-center justify-start gap-1.5 border-none text-sm font-medium shadow-none ${className ?? ""}`}
              onClick={() => (deleteAllowed ? setShowDeleteDialog(true) : undefined)}
              disabled={isDisabled}
              type="button"
              aria-label="Delete role"
            >
              <Trash2 className="group-hover:text-destructive-900 text-destructive h-4 w-4 transition-colors duration-150" />
              <span>Delete Role</span>
            </Button>
          </DisabledTooltip>
        );
      })()}

      <ConfirmationDialog
        title="Delete Role"
        description={`Permanently delete the role "${role.name}"? This action cannot be undone.`}
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
