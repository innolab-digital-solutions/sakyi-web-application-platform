import { Trash2, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Program, ProgramApiResponse } from "@/types/admin/program";
import { cn } from "@/utils/shared/cn";

interface ProgramDeletionDialogProperties {
  program: Program;
  className?: string;
}

export default function ProgramDeletionDialog({
  program,
  className,
}: ProgramDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const request = useRequest();

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.PROGRAMS.DESTROY(program.id), {
      tanstack: {
        invalidateQueries: ["admin-programs"],
        mutationOptions: {
          onSuccess: () => {
            // Optimistic cache update - remove the deleted food category from the list
            request.queryCache.setQueryData<ProgramApiResponse>(
              ["admin-programs"],
              (previous) => {
                if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                  return previous;
                }

                return {
                  ...previous,
                  data: previous.data.filter((p) => p.id !== program.id),
                } as ProgramApiResponse;
              },
              { all: true },
            );

            closeDeleteDialog();
            toast.success("Program deleted successfully.");
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
        const deleteAllowed = Boolean(program.actions?.delete?.allowed);
        const deleteReasons = program.actions?.delete?.reasons ?? [];
        const isDisabled = isLoading || !deleteAllowed;

        let disabledReason: string | undefined;
        if (isLoading) {
          disabledReason = "Deleting in progress. Please wait.";
        } else if (!deleteAllowed && deleteReasons.length > 0) {
          disabledReason = deleteReasons[0]?.trim() || undefined;
        }

        return (
          <DisabledTooltip reason={disabledReason}>
            <Button
              variant="outline"
              className={cn(
                "hover:bg-destructive/10! text-destructive group hover:text-destructive-900! hover:ring-none! flex w-full cursor-pointer! items-center justify-start gap-1.5 border-none! text-sm font-medium shadow-none disabled:hover:bg-transparent! disabled:hover:text-inherit!",
                className,
              )}
              onClick={() => (deleteAllowed ? setShowDeleteDialog(true) : undefined)}
              disabled={isDisabled}
              type="button"
              aria-label="Delete program"
            >
              <Trash2 className="group-hover:text-destructive-900 text-destructive h-4 w-4 transition-colors duration-150" />
              <span>Delete Program</span>
            </Button>
          </DisabledTooltip>
        );
      })()}

      <ConfirmationDialog
        title="Delete Program"
        description={`Permanently delete the program "${program.title}"? This action cannot be undone.`}
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
