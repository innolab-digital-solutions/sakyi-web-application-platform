import { ClipboardList } from "lucide-react";
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
      icon={ClipboardList}
      title="Program Management"
      description="Design, organize, and maintain your programs. Publish with clear outcomes and structure so clients know exactly what to expect."
      createTrigger={
        <Button asChild>
          <Link href={PATHS.ADMIN.PROGRAMS.CREATE}>Add Program</Link>
        </Button>
      }
      table={<ProgramTable />}
    />
  );
}
