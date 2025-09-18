"use client";

import { ClipboardCheck, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ADMIN } from "@/config/routes";
import { PageHeader } from "@/components/admin/shared/page-header";
import { EnrollmentTable } from "@/components/admin/features/enrollments/enrollment-table";
import { mockEnrollments } from "@/lib/mock/enrollments";

export default function EnrollmentListPage() {
  return (
    <div>
      <PageHeader
        icon={ClipboardCheck}
        title="Enrollment List"
        description="View and manage all program enrollments in this page."
        actions={
          <>
            <Button
              asChild
              variant="default"
              className="flex items-center gap-2 font-medium text-sm w-full sm:w-auto"
            >
              <Link
                href={ADMIN.ENROLLMENTS.CREATE}
                className="w-full flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
                <span>Add Enrollment</span>
              </Link>
            </Button>
          </>
        }
      />

      <EnrollmentTable data={mockEnrollments} />
    </div>
  );
}
