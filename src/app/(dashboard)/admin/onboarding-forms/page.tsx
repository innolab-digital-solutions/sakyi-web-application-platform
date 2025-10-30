import { ListChecks, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import OnboardingFormTable from "@/components/admin/features/onboarding-forms/onboarding-form-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Onboarding Form | SaKyi Health & Wellness",
  description:
    "Manage wellness programs including fitness routines, nutrition plans, and health challenges.",
};

export default function OnboardingFormsListPage() {
  return (
    <ResourceListPage
      icon={ListChecks}
      title="Onboarding Forms"
      description="Manage all your organization’s health, wellness, coaching, and guardianship programs here. Organize, update, and present services to better serve your clients’ needs."
      createTrigger={
        <Button
          asChild
          variant="default"
          className="flex cursor-pointer items-center gap-2 font-semibold"
        >
          <Link href={PATHS.ADMIN.ONBOARDING_FORMS.CREATE}>
            <Plus className="h-4 w-4" />
            Create Onboarding Form
          </Link>
        </Button>
      }
      table={<OnboardingFormTable />}
    />
  );
}
