import { ListChecks } from "lucide-react";
import type { Metadata } from "next";
import React from "react";

import OnboardingFormTable from "@/components/admin/features/onboarding-forms/onboarding-form-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Program Management | SaKyi Health & Wellness",
  description:
    "Manage wellness programs including fitness routines, nutrition plans, and health challenges.",
};

export default function OnboardingFormsListPage() {
  return (
    <ResourceListPage
      icon={ListChecks}
      title="Onboarding Forms"
      description="Manage all your organization’s health, wellness, coaching, and guardianship programs here. Organize, update, and present services to better serve your clients’ needs."
      table={<OnboardingFormTable />}
    />
  );
}
