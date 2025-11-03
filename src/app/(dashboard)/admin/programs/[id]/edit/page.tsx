"use client";

import React from "react";

import ProgramFormPage from "@/components/admin/features/programs/program-form-page";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Program } from "@/types/admin/program";

export default function EditProgramPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const resolvedParameters = React.use(params);

  const { data, loading } = useRequest({
    url: ENDPOINTS.ADMIN.PROGRAMS.SHOW(resolvedParameters.id),
    queryKey: ["admin-program", resolvedParameters.id],
  });

  const loadedProgram = (data?.data as Program) || undefined;

  if (loading) {
    return (
      <div className="rounded-md border border-gray-200 p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-200" />
        <div className="mt-3 h-24 w-full animate-pulse rounded bg-gray-200" />
      </div>
    );
  }

  return <ProgramFormPage program={loadedProgram} />;
}
