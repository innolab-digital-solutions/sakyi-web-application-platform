import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import ProgramFormPage from "@/components/admin/features/programs/program-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Create Program — SaKyi Health & Wellness",
  description:
    "Set up a new program with the essentials, then add audience, features, outcomes, structure, and FAQs.",
};

export default function CreateProgramPage() {
  return (
    <div className="flex flex-col gap-2 p-6">
      <PageHeader
        title="Create New Program"
        description="Set up a new wellness program with essential details including title, description, duration, price, thumbnail, and target audience. Add key features, expected outcomes, program structure, and FAQs to provide comprehensive information for potential participants."
        actions={
          <Button variant="outline" asChild>
            <Link
              href={PATHS.ADMIN.PROGRAMS.LIST}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:bg-gray-100! hover:text-gray-800!"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        }
      />

      <ProgramFormPage />
    </div>
  );
}
