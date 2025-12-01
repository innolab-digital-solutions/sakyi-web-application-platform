import { ArrowLeft, ClipboardCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

import OnboardingForm from "@/components/admin/features/onboarding-forms/onboarding-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

export const metadata: Metadata = {
  title: "Create Onboarding Form — SaKyi Health & Wellness",
  description:
    "Set up sections and questions, then publish and attach the form to programs for a guided client intake.",
};

export default function CreateOnboardingFormPage() {
  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={ClipboardCheck}
        title="Create Onboarding Form"
        description="Build a structured form with sections and customizable questions. Attach it to one or more programs for a smooth client intake."
        actions={
          <Button variant="outline" asChild>
            <Link
              href={PATHS.ADMIN.ONBOARDING_FORMS.LIST}
              className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:!bg-gray-100 hover:!text-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
        }
      />

      <OnboardingForm />
    </div>
  );
}
