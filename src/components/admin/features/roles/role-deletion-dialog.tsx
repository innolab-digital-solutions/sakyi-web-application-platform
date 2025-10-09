import { FileQuestionMark, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Role } from "@/types/admin/role";

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
      requireAuth: true,
      tanstack: {
        invalidateQueries: ["admin-roles"],
        mutationOptions: {
          onSuccess: () => {
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
      <Button
        variant="outline"
        className={`hover:!bg-destructive/10 text-destructive group hover:text-destructive-900 hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium shadow-none ${className ?? ""}`}
        onClick={() => setShowDeleteDialog(true)}
        disabled={request.loading}
        type="button"
        aria-label="Delete role"
      >
        <Trash2 className="group-hover:text-destructive-900 text-destructive h-4 w-4 transition-colors duration-150" />
        <span>Delete Role</span>
      </Button>

      <ConfirmationDialog
        title="Delete Role Confirmation"
        description={`Permanently delete the role "${role.name}"? This action cannot be undone.`}
        icon={FileQuestionMark}
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
