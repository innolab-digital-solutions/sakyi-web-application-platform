"use client";

import React from "react";

import BlogDetailPage from "@/app/(public)/blog/[slug]/page";

export default function AdminBlogPostPreviewPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const resolvedParameters = React.use(params);
  const slugParameters = React.useMemo(
    () =>
      Promise.resolve({
        slug: resolvedParameters.id,
      }),
    [resolvedParameters.id],
  );

  return <BlogDetailPage params={slugParameters} />;
}
