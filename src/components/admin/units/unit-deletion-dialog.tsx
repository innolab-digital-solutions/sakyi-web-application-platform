import { Trash } from "lucide-react";
import React, { useState } from "react";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Unit } from "@/types/admin/unit";

interface UnitDeletionDialogProperties {
  unit: Unit;
  className?: string;
}

export default function UnitDeletionDialog({ unit, className }: UnitDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const handleDeleteConfirm = () => {
    alert(`Delete unit: ${unit.name}`);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className={`flex cursor-pointer items-center gap-1.5 text-[13px] font-medium ${className}`}
        onClick={() => setShowDeleteDialog(true)}
        disabled={false}
      >
        <Trash className="h-2 w-2" />
        <span>Delete</span>
      </Button>

      <ConfirmationDialog
        title="Delete Unit Confirmation"
        description="Are you sure you want to delete this unit? This action cannot be undone."
        icon={Trash}
        variant="destructive"
        confirmText="Delete"
        isOpen={showDeleteDialog}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isLoading={false}
      />
    </>
  );
}
