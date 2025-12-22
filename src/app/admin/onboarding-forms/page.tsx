import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import OnboardingFormTable from "@/components/admin/features/onboarding-forms/onboarding-form-table";
import ResourceListPage from "@/components/admin/shared/resource-list-page";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Onboarding Forms — SaKyi Health & Wellness",
  description:
    "Build and manage client intake forms with sections and smart questions for consistent, high‑quality data.",
};

export default function OnboardingFormsListPage() {
  return (
    <ResourceListPage
      title="Onboarding Forms"
      description="Manage the intake forms used before clients enroll in programs, including health, lifestyle, and background questions."
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
