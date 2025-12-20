"use client";

import { Archive, Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { BlogPost, BlogPostApiResponse } from "@/types/admin/blog-post";

interface BlogPostArchiveButtonProperties {
  blogPost: BlogPost;
  className?: string;
}

export default function BlogPostArchiveButton({
  blogPost,
  className,
}: BlogPostArchiveButtonProperties) {
  const request = useRequest();

  const isPublished = blogPost.status === "published";
  const isArchived = blogPost.status === "archived";
  const isDraft = blogPost.status === "draft";
  const canArchive = isPublished || isArchived;
  const isLoading = request.loading;

  const handleArchiveToggle = () => {
    if (!canArchive || isLoading) return;

    const newStatus = isPublished ? "archived" : "published";

    request.patch(
      ENDPOINTS.ADMIN.BLOG_POSTS.STATUS(blogPost.id),
      { status: newStatus },
      {
        tanstack: {
          invalidateQueries: ["admin-blog-posts"],
          mutationOptions: {
            onSuccess: () => {
              // Optimistic cache update
              request.queryCache.setQueryData<BlogPostApiResponse>(
                ["admin-blog-posts"],
                (previous) => {
                  if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                    return previous;
                  }

                  return {
                    ...previous,
                    data: previous.data.map((post) =>
                      post.id === blogPost.id ? { ...post, status: newStatus } : post,
                    ),
                  } as BlogPostApiResponse;
                },
                { all: true },
              );

              // Update the specific blog post cache if available
              request.queryCache.setQueryData(
                ["admin-blog-post", String(blogPost.id)],
                (previous: unknown) => {
                  if (
                    !previous ||
                    typeof previous !== "object" ||
                    !("status" in previous) ||
                    (previous as { status: string }).status !== "success"
                  ) {
                    return previous;
                  }
                  const previous_ = previous as {
                    status: string;
                    data: BlogPost;
                    message?: string;
                  };
                  return {
                    ...previous_,
                    data: { ...previous_.data, status: newStatus },
                  };
                },
                { all: true },
              );

              toast.success(
                `Blog post ${newStatus === "archived" ? "archived" : "restored to published"} successfully.`,
              );
            },
            onError: (error) => {
              toast.error(error.message);
            },
          },
        },
      },
    );
  };

  const disabledReason = isDraft
    ? "Draft posts cannot be archived. Publish the post first to enable archiving."
    : undefined;

  return (
    <DisabledTooltip reason={disabledReason}>
      <Button
        variant="outline"
        className={`hover:bg-accent/10! group hover:text-accent! hover:ring-none! flex w-full cursor-pointer! items-center justify-start gap-1.5 border-none! text-sm font-medium text-gray-700 shadow-none disabled:hover:bg-transparent! disabled:hover:text-inherit! ${className ?? ""}`}
        onClick={handleArchiveToggle}
        disabled={!canArchive || isLoading}
        aria-label={isArchived ? "Restore to published" : "Move to archive"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin transition-colors duration-150" />
        ) : (
          <Archive className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
        )}
        <span>{isArchived ? "Restore to Published" : "Move to Archive"}</span>
      </Button>
    </DisabledTooltip>
  );
}
