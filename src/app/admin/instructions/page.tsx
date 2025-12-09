import { ClipboardList, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import InstructionTable from "@/components/admin/features/instructions/instruction-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Instructions — SaKyi Health & Wellness",
  description:
    "Create and manage personalized health and wellness instructions with daily meals, workouts, activities, water, and sleep targets.",
};

export default function InstructionsListPage() {
  return (
    <ResourceListPage
      icon={ClipboardList}
      title="Instructions"
      description="Create comprehensive daily instructions with meals, workouts, activities, water intake, and sleep targets for enrolled clients."
      createTrigger={
        <Button
          asChild
          variant="default"
          className="flex cursor-pointer items-center gap-2 font-semibold"
        >
          <Link href={PATHS.ADMIN.INSTRUCTIONS.CREATE}>
            <Plus className="h-4 w-4" />
            Create Instruction
          </Link>
        </Button>
      }
      table={<InstructionTable />}
    />
  );
}
