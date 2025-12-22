import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import ProgramTable from "@/components/admin/features/programs/program-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Programs — SaKyi Health & Wellness",
  description:
    "Create and manage programs with clear outcomes and structure. Keep offerings organized and easy to maintain.",
};

export default function ProgramsListPage() {
  return (
    <ResourceListPage
      title="Program Management"
      description="Create and manage wellness programs with comprehensive details including features, outcomes, structure, and FAQs. Organize programs by duration, price, and target audience to support client enrollment and program delivery."
      createTrigger={
        <Button asChild>
          <Link
            href={PATHS.ADMIN.PROGRAMS.CREATE}
            className="flex cursor-pointer items-center gap-2 font-semibold"
          >
            <Plus className="h-4 w-4" />
            Add Program
          </Link>
        </Button>
      }
      table={<ProgramTable />}
    />
  );
}
