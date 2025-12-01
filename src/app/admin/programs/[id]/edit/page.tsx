"use client";

import { ArrowLeft, ClipboardList } from "lucide-react";
import Link from "next/link";
import React from "react";

import ProgramForm from "@/components/admin/features/programs/program-form";
import ProgramFormSkeleton from "@/components/admin/features/programs/program-form-skeleton";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
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
    return <ProgramFormSkeleton />;
  }

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={ClipboardList}
        title="Edit Program"
        description="Update details and structure with confidence. Refine the basics or adjust audience, features, outcomes, and weekly plan—changes help clients understand what’s new."
        actions={
          <Button variant="outline" asChild>
            <Link
              href={PATHS.ADMIN.PROGRAMS.LIST}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:!bg-gray-100 hover:!text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        }
      />

      <ProgramForm program={loadedProgram} />
    </div>
  );
}
