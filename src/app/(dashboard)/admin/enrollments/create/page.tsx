import { ArrowLeft, ClipboardCheck } from "lucide-react";
import Link from "next/link";

import { EnrollmentForm } from "@/components/admin/features/enrollments/enrollment-form";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { ADMIN } from "@/config/routes";

export default function EnrollmentCreatePage() {
  return (
    <div>
      <PageHeader
        icon={ClipboardCheck}
        title="Add Enrollment"
        description="Create a new program enrollment in the page."
        actions={
          <>
            <Button
              asChild
              variant="default"
              className="flex w-full items-center gap-2 text-sm font-medium sm:w-auto"
            >
              <Link
                href={ADMIN.ENROLLMENTS.LIST}
                className="flex w-full items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Link>
            </Button>
          </>
        }
      />

      <EnrollmentForm />
    </div>
  );
}
