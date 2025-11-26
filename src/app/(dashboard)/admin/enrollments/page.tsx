import { ClipboardList, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import EnrollmentTable from "@/components/admin/features/enrollments/enrollment-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Enrollments — SaKyi Health & Wellness",
  description:
    "Manage program enrollments for users, track their progress, status, and details in one place.",
};

export default function EnrollmentListPage() {
  return (
    <ResourceListPage
      icon={ClipboardList}
      title="Enrollments"
      description="Add, view, and manage user enrollments for programs and teams—keep track of status, duration, and progress efficiently."
      createTrigger={
        <Button
          asChild
          variant="default"
          className="flex cursor-pointer items-center gap-2 font-semibold"
        >
          <Link href={PATHS.ADMIN.ENROLLMENTS.CREATE}>
            <Plus className="h-4 w-4" />
            Create Enrollment
          </Link>
        </Button>
      }
      table={<EnrollmentTable />}
    />
  );
}
