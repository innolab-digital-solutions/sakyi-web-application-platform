"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

import InstructionForm from "@/components/admin/features/instructions/instruction-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useRequest } from "@/hooks/use-request";
import { Instruction } from "@/types/admin/instruction";

export default function EditInstructionPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const resolvedParameters = React.use(params);

  const { data: instruction, loading: isLoading } = useRequest({
    url: ENDPOINTS.ADMIN.INSTRUCTIONS.SHOW(resolvedParameters.id),
    queryKey: ["admin-instruction", resolvedParameters.id],
  });

  const loadedInstruction = instruction?.data as Instruction | undefined;

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        title="Edit Instruction"
        description="Update meals, workouts, activities, water, and sleep targets. Changes apply immediately to the instruction."
        actions={
          <Button variant="outline" asChild>
            <Link
              href={PATHS.ADMIN.INSTRUCTIONS.LIST}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:!bg-gray-100 hover:!text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        }
      />

      {isLoading && (
        <div className="rounded-md border border-gray-200 p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-24 w-full animate-pulse rounded bg-gray-200" />
        </div>
      )}

      {!isLoading && loadedInstruction && <InstructionForm instruction={loadedInstruction} />}
    </div>
  );
}
