import { FileQuestionMark, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { FoodCategory } from "@/types/admin/food-category";
import { cn } from "@/utils/shared/cn";

interface FoodCategoryDeletionDialogProperties {
  foodCategory: FoodCategory;
  className?: string;
}

export default function FoodCategoryDeletionDialog({
  foodCategory,
  className,
}: FoodCategoryDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const request = useRequest();

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.FOOD_CATEGORIES.DESTROY(foodCategory.id), {
      requireAuth: true,
      tanstack: {
        invalidateQueries: ["admin-food-categories"],
        mutationOptions: {
          onSuccess: () => {
            closeDeleteDialog();
            toast.success("Food category deleted successfully.");
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
        aria-label="Delete food category"
      >
        <Trash2 className="h-2 w-2" />
        <span>Delete</span>
      </Button>

      <ConfirmationDialog
        title="Delete Food Category Confirmation"
        description={`Permanently delete the role "${foodCategory.name}"? This action cannot be undone.`}
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
