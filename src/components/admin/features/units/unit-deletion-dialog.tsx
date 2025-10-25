import { Trash2, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Unit, UnitApiResponse } from "@/types/admin/unit";
import { cn } from "@/utils/shared/cn";

interface UnitDeletionDialogProperties {
  unit: Unit;
  className?: string;
}

export default function UnitDeletionDialog({ unit, className }: UnitDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const request = useRequest();

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.UNITS.DESTROY(unit.id), {
      tanstack: {
        invalidateQueries: ["admin-units"],
        mutationOptions: {
          onSuccess: () => {
            // Optimistic cache update - remove the deleted unit from the list
            request.queryCache.setQueryData<UnitApiResponse>(
              ["admin-units"],
              (previous) => {
                if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                  return previous;
                }

                return {
                  ...previous,
                  data: previous.data.filter((u) => u.id !== unit.id),
                } as UnitApiResponse;
              },
              { all: true },
            );

            closeDeleteDialog();
            toast.success("Unit deleted successfully.");
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
        const isDeletable = Boolean(unit.actions?.deletable);
        const isDisabled = isLoading || !isDeletable;
        let disabledReason: string | undefined;
        if (isLoading) {
          disabledReason = "Deleting in progress. Please wait.";
        } else if (!isDeletable) {
          disabledReason = "You don't have permission to delete this unit.";
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
              aria-label="Delete unit"
            >
              <Trash2 className="h-2 w-2" />
              <span>Delete</span>
            </Button>
          </DisabledTooltip>
        );
      })()}

      <ConfirmationDialog
        title="Delete Unit"
        description={`Permanently delete the unit "${unit.name}"? This action cannot be undone.`}
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
