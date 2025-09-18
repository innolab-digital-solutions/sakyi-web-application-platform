"use client";

import { ClipboardCheck, Plus } from "lucide-react";
import Link from "next/link";

import { EnrollmentTable } from "@/components/admin/features/enrollments/enrollment-table";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { ADMIN } from "@/config/routes";
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
              className="flex w-full items-center gap-2 text-sm font-medium sm:w-auto"
            >
              <Link
                href={ADMIN.ENROLLMENTS.CREATE}
                className="flex w-full items-center justify-center"
              >
                <Plus className="h-4 w-4" />
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
