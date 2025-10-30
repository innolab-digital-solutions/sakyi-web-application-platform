"use client";

import { ArrowLeft, ClipboardList } from "lucide-react";
import Link from "next/link";
import React from "react";

import OnboardingForm from "@/components/admin/features/onboarding-forms/onboarding-form";
import PageHeader from "@/components/admin/shared/page-header";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useRequest } from "@/hooks/use-request";
import { OnboardingForm as OnboardingFormType } from "@/types/admin/onboarding-form";

export default function EditOnboardingFormPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const resolvedParameters = React.use(params);

  const { data: onboardingForm } = useRequest({
    url: ENDPOINTS.ADMIN.ONBOARDING_FORMS.SHOW(resolvedParameters.id),
    queryKey: ["admin-onboarding-form", resolvedParameters.id],
  });

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={ClipboardList}
        title="Edit Onboarding Form"
        description="Design a multi-section onboarding form with customizable questions and attach it to one or more programs."
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

      <OnboardingForm onboardingForm={onboardingForm?.data as OnboardingFormType} />
    </div>
  );
}
