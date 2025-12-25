import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import InstructionForm from "@/components/admin/features/instructions/instruction-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Create Instruction — SaKyi Health & Wellness",
  description:
    "Create a new instruction with daily meals, workouts, activities, water intake, and sleep targets.",
};

export default function CreateInstructionPage() {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        title="Create Instruction"
        description="Set up a comprehensive daily instruction plan with meals, workouts, activities, water, and sleep targets for your client."
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

      <InstructionForm />
    </div>
  );
}
