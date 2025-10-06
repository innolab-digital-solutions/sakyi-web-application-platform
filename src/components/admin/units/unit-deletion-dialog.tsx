import { Trash } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Unit } from "@/types/admin/unit";
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
      requireAuth: true,
      tanstack: {
        invalidateQueries: ["admin-units"],
        mutationOptions: {
          onSuccess: () => {
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
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "hover:bg-destructive/10 hover:text-destructive text-destructive flex cursor-pointer items-center justify-center text-sm font-semibold",
          className,
        )}
        disabled={request.loading}
        onClick={() => setShowDeleteDialog(true)}
        aria-label="Delete unit"
      >
        <Trash className="h-2 w-2" />
        <span>Delete</span>
      </Button>

      <ConfirmationDialog
        title="Delete Unit Confirmation"
        description="Are you sure you want to delete this unit? This action cannot be undone."
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
