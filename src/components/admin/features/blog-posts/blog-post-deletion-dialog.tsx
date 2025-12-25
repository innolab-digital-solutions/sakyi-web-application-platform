import { Trash2, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { BlogPost, BlogPostApiResponse } from "@/types/admin/blog-post";
import { cn } from "@/utils/shared/cn";

interface BlogPostDeletionDialogProperties {
  blogPost: BlogPost;
  className?: string;
}

export default function BlogPostDeletionDialog({
  blogPost,
  className,
}: BlogPostDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const request = useRequest();

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.BLOG_POSTS.DESTROY(blogPost.id), {
      tanstack: {
        invalidateQueries: ["admin-blog-posts"],
        mutationOptions: {
          onSuccess: () => {
            // Optimistic cache update - remove the deleted blog category from the list
            request.queryCache.setQueryData<BlogPostApiResponse>(
              ["admin-blog-posts"],
              (previous) => {
                if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                  return previous;
                }

                return {
                  ...previous,
                  data: previous.data.filter((bp) => bp.id !== blogPost.id),
                } as BlogPostApiResponse;
              },
              { all: true },
            );

            closeDeleteDialog();
            toast.success("Blog post deleted successfully.");
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
        const deleteAllowed = Boolean(blogPost.actions?.delete?.allowed);
        const deleteReasons = blogPost.actions?.delete?.reasons ?? [];
        const isDisabled = isLoading || !deleteAllowed;

        let disabledReason: string | undefined;
        if (isLoading) {
          disabledReason = "Deleting in progress. Please wait.";
        } else if (!deleteAllowed && deleteReasons.length > 0) {
          disabledReason = deleteReasons[0]?.trim() || undefined;
        }

        const hasReason = Boolean(disabledReason);
        const tooltipCursorClass = isDisabled && hasReason ? "cursor-help" : undefined;

        return (
          <DisabledTooltip reason={disabledReason} className={tooltipCursorClass}>
            <Button
              variant="outline"
              className={cn(
                "hover:bg-destructive/10 text-destructive group hover:text-destructive-900 hover:ring-none! flex w-full cursor-pointer! items-center justify-start gap-1.5 border-none text-sm font-medium shadow-none",
                className,
              )}
              onClick={() => (deleteAllowed ? setShowDeleteDialog(true) : undefined)}
              disabled={isDisabled}
              type="button"
              aria-label="Delete blog post"
            >
              <Trash2 className="group-hover:text-destructive-900 text-destructive h-4 w-4 transition-colors duration-150" />
              <span>Delete Post</span>
            </Button>
          </DisabledTooltip>
        );
      })()}

      <ConfirmationDialog
        title="Delete Blog Post"
        description={`Permanently delete the blog post "${blogPost.title}"? This action cannot be undone.`}
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
