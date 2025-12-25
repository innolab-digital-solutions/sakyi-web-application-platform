"use client";

import React from "react";

import PublicProgramPage from "@/app/(public)/programs/[slug]/page";

export default function AdminProgramPreviewPage({
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

  return <PublicProgramPage params={slugParameters} />;
}
