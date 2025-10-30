import { FileQuestionMark, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
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
      {(() => {
        const isLoading = request.loading;
        const isDeletable = Boolean(foodItem.actions?.deletable);
        const isDisabled = isLoading || !isDeletable;
        let disabledReason: string | undefined;
        if (isLoading) {
          disabledReason = "Deleting in progress. Please wait.";
        } else if (!isDeletable) {
          disabledReason = "You don't have permission to delete this item.";
        }

        return (
          <DisabledTooltip reason={disabledReason}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-destructive/10 hover:text-destructive text-destructive flex cursor-pointer items-center justify-center text-sm font-semibold",
                className,
              )}
              disabled={isDisabled}
              onClick={() => (isDeletable ? setShowDeleteDialog(true) : undefined)}
              aria-label="Delete food item"
            >
              <Trash2 className="h-2 w-2" />
              <span>Delete</span>
            </Button>
          </DisabledTooltip>
        );
      })()}

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
