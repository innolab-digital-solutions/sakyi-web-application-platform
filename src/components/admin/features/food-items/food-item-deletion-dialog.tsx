import { FileQuestionMark, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { FoodItem } from "@/types/admin/food-item";
import { cn } from "@/utils/shared/cn";

interface FoodItemDeletionDialogProperties {
  foodItem: FoodItem;
  className?: string;
}

export default function FoodItemDeletionDialog({
  foodItem,
  className,
}: FoodItemDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const request = useRequest();

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.FOOD_ITEMS.DESTROY(foodItem.id), {
      tanstack: {
        invalidateQueries: ["admin-food-items"],
        mutationOptions: {
          onSuccess: () => {
            closeDeleteDialog();
            toast.success("Food item deleted successfully.");
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
        aria-label="Delete food item"
      >
        <Trash2 className="h-2 w-2" />
        <span>Delete</span>
      </Button>

      <ConfirmationDialog
        title="Delete Food Item Confirmation"
        description={`Permanently delete the food item "${foodItem.name}"? This action cannot be undone.`}
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
