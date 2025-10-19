import { Trash2, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Program, ProgramApiResponse } from "@/types/admin/program";

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
      <Button
        variant="outline"
        className={`hover:!bg-destructive/10 text-destructive group hover:text-destructive-900 hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium shadow-none ${className ?? ""}`}
        onClick={() => setShowDeleteDialog(true)}
        disabled={request.loading}
        type="button"
        aria-label="Delete program"
      >
        <Trash2 className="group-hover:text-destructive-900 text-destructive h-4 w-4 transition-colors duration-150" />
        <span>Delete Program</span>
      </Button>

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
