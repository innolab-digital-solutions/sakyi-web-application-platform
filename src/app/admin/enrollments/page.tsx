import type { Metadata } from "next";
import React from "react";

import EnrollmentTable from "@/components/admin/features/enrollments/enrollment-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Enrollments — SaKyi Health & Wellness",
  description:
    "View and manage client enrollments across programs and teams, including statuses and timelines.",
};

export default function EnrollmentsListPage() {
  return (
    <ResourceListPage
      title="Enrollments"
      description="Review and manage all client enrollments across programs and teams. Track enrollment periods, status changes, and timelines to ensure clients are progressing smoothly through your services."
      table={<EnrollmentTable />}
    />
  );
}
