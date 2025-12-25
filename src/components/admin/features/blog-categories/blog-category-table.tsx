"use client";

import React from "react";

import { blogCategoriesTableColumns } from "@/components/admin/features/blog-categories/blog-category-table-columns";
import ResourceTable from "@/components/admin/shared/resource-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ENDPOINTS } from "@/config/endpoints";
import { BlogCategory } from "@/types/admin/blog-category";

export default function BlogCategoryTable() {
  return (
    <ResourceTable<BlogCategory>
      endpoint={ENDPOINTS.ADMIN.BLOG_CATEGORIES.INDEX}
      queryKey={["admin-blog-categories"]}
      columns={blogCategoriesTableColumns}
      skeleton={{
        customSkeletons: {
          name: (
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 animate-pulse rounded" />
              <Skeleton className="h-3 w-96 animate-pulse rounded" />
            </div>
          ),
          actions: (
            <div className="flex items-center space-x-1">
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
              <Skeleton className="h-8 w-16 animate-pulse rounded" />
            </div>
          ),
        },
      }}
      emptyMessage="No blog categories found. Create your first blog category to get started."
    />
  );
}
