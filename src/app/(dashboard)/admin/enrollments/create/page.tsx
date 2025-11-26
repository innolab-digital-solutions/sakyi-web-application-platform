import { ArrowLeft, ClipboardCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import EnrollmentForm from "@/components/admin/features/enrollments/enrollment-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Create Enrollment — SaKyi Health & Wellness",
  description:
    "Register users for programs, teams, or submissions, set duration, start/end dates, and track status.",
};

export default function CreateEnrollmentPage() {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={ClipboardCheck}
        title="Create Enrollment"
        description="Register users for a program or team, assign submissions, set duration and dates, and manage enrollment status."
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

      <EnrollmentForm />
    </div>
  );
}
