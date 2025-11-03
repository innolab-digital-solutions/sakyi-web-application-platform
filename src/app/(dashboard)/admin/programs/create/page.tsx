import { ArrowLeft, ClipboardList } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import ProgramForm from "@/components/admin/features/programs/program-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Create Program",
};

export default function CreateProgramPage() {
  return (
    <div className="flex flex-col">
      <PageHeader
        icon={ClipboardList}
        title="Create Program"
        description="Create a new program with title, description, duration, pricing, status and related items."
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

      <ProgramForm />
    </div>
  );
}
