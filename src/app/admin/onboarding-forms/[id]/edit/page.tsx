"use client";

import { ArrowLeft, ClipboardCheck } from "lucide-react";
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

  const { data: onboardingForm, loading: isLoading } = useRequest({
    url: ENDPOINTS.ADMIN.ONBOARDING_FORMS.SHOW(resolvedParameters.id),
    queryKey: ["admin-onboarding-form", resolvedParameters.id],
  });

  const loadedForm = onboardingForm?.data as OnboardingFormType | undefined;

  return (
    <div className="flex flex-col gap-2">
      <PageHeader
        icon={ClipboardCheck}
        title="Edit Onboarding Form"
        description="Update sections, questions, and settings. Changes apply immediately anywhere this form is used."
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

      {isLoading && (
        <div className="rounded-md border border-gray-200 p-6">
          <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
          <div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-24 w-full animate-pulse rounded bg-gray-200" />
        </div>
      )}

      {!isLoading && loadedForm && <OnboardingForm onboardingForm={loadedForm} />}
    </div>
  );
}
