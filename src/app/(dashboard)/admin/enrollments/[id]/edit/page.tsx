"use client";

import { ArrowLeft, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import React from "react";

import EnrollmentForm from "@/components/admin/features/enrollments/enrollment-form";
import EnrollmentFormSkeleton from "@/components/admin/features/enrollments/enrollment-form-skeleton";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useRequest } from "@/hooks/use-request";
import { Enrollment } from "@/types/admin/enrollment";

export default function EditEnrollmentPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const resolvedParameters = React.use(params);

  const { data: enrollment, loading: isLoading } = useRequest({
    url: ENDPOINTS.ADMIN.ENROLLMENTS.SHOW(resolvedParameters.id),
    queryKey: ["admin-blog-post", resolvedParameters.id],
  });

  const loadedEnrollment = enrollment?.data as Enrollment | undefined;

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={ClipboardCheck}
        title="Edit Enrollment"
        description="Update user, program, team, submission, duration, dates, or status to keep enrollment information accurate and up to date."
        actions={
          <Button variant="outline" asChild>
            <Link
              href={PATHS.ADMIN.ENROLLMENTS.LIST}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:!bg-gray-100 hover:!text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        }
      />

      {isLoading && <EnrollmentFormSkeleton />}

      {!isLoading && loadedEnrollment && <EnrollmentForm enrollment={loadedEnrollment} />}
    </div>
  );
}
