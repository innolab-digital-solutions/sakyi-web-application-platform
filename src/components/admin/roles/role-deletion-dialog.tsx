import { Trash } from "lucide-react";
import React, { useState } from "react";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/admin/role";

interface RoleDeletionDialogProperties {
  role: Role;
  className?: string;
}

export default function RoleDeletionDialog({ role, className }: RoleDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const handleDeleteConfirm = () => {
    alert(`Delete role: ${role.name}`);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Button
        variant="outline"
        className={`hover:!bg-destructive/10 text-destructive group hover:text-destructive-900 hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium shadow-none ${className ?? ""}`}
        onClick={() => setShowDeleteDialog(true)}
        disabled={false}
        type="button"
        aria-label="Delete role"
      >
        <Trash className="group-hover:text-destructive-900 text-destructive h-4 w-4 transition-colors duration-150" />
        <span>Delete Role</span>
      </Button>

      <ConfirmationDialog
        title="Delete Role Confirmation"
        description="Are you sure you want to delete this role? This action cannot be undone."
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
