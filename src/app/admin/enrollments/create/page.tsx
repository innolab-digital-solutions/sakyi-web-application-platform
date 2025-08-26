import { EnrollmentForm } from "@/components/admin/features/enrollments/enrollment-form";
import { PageHeader } from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { ADMIN } from "@/lib/constants/routes/admin";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import Link from "next/link";

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
              className="flex items-center gap-2 font-medium text-sm w-full sm:w-auto"
            >
              <Link
                href={ADMIN.ENROLLMENTS.LIST}
                className="w-full flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
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
