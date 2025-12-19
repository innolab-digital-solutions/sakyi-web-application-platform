"use client";

import React from "react";

import { blogPostsTableColumns } from "@/components/admin/features/blog-posts/blog-post-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { BlogPost } from "@/types/admin/blog-post";

export default function BlogPostTable() {
  return (
    <ResourceTable<BlogPost>
      endpoint={ENDPOINTS.ADMIN.BLOG_POSTS.INDEX}
      queryKey={["admin-blog-posts"]}
      columns={blogPostsTableColumns}
      skeleton={{
        customSkeletons: {
          title: (
            <div className="flex min-w-0 items-start gap-4">
              <Skeleton className="size-12 shrink-0 animate-pulse rounded-md" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-4 w-48 animate-pulse rounded" />
                  <Skeleton className="h-5 w-16 animate-pulse rounded" />
                </div>
                <Skeleton className="h-3 w-96 animate-pulse rounded" />
              </div>
            </div>
          ),
          category: <Skeleton className="h-5 w-24 animate-pulse rounded" />,
          published_at: <Skeleton className="h-5 w-32 animate-pulse rounded" />,
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No blog posts found. Create your first blog post to get started."
    />
  );
}
