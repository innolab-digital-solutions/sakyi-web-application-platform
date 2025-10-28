import { Trash2, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { BlogCategory, BlogCategoryApiResponse } from "@/types/admin/blog-category";
import { cn } from "@/utils/shared/cn";

interface BlogCategoryDeletionDialogProperties {
  blogCategory: BlogCategory;
  className?: string;
}

export default function BlogCategoryDeletionDialog({
  blogCategory,
  className,
}: BlogCategoryDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const request = useRequest();

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.BLOG_CATEGORIES.DESTROY(blogCategory.id), {
      tanstack: {
        invalidateQueries: ["admin-blog-categories"],
        mutationOptions: {
          onSuccess: () => {
            // Optimistic cache update - remove the deleted blog category from the list
            request.queryCache.setQueryData<BlogCategoryApiResponse>(
              ["admin-blog-categories"],
              (previous) => {
                if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                  return previous;
                }

                return {
                  ...previous,
                  data: previous.data.filter((bc) => bc.id !== blogCategory.id),
                } as BlogCategoryApiResponse;
              },
              { all: true },
            );

            closeDeleteDialog();
            toast.success("Blog category deleted successfully.");
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
        aria-label="Delete blog category"
      >
        <Trash2 className="h-2 w-2" />
        <span>Delete</span>
      </Button>

      <ConfirmationDialog
        title="Delete Blog Category"
        description={`Permanently delete the blog category "${blogCategory.name}"? This action cannot be undone.`}
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
