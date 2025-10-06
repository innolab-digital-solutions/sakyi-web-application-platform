import { Trash } from "lucide-react";
import React, { useState } from "react";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { FoodCategory } from "@/types/admin/food-category";
import { cn } from "@/utils/shared/cn";

interface FoodCategoryDeletionDialog {
  foodCategory: FoodCategory;
  className?: string;
}

export default function RoleDeletionDialog({
  foodCategory,
  className,
}: FoodCategoryDeletionDialog) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const handleDeleteConfirm = () => {
    alert(`Delete food category: ${foodCategory.name}`);
    setShowDeleteDialog(false);
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
        onClick={() => setShowDeleteDialog(true)}
        disabled={false}
      >
        <Trash className="h-2 w-2" />
        <span>Delete</span>
      </Button>

      <ConfirmationDialog
        title="Delete Food Category Confirmation"
        description="Are you sure you want to delete this category? This action cannot be undone."
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
