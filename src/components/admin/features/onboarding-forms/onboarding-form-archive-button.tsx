"use client";

import { Archive, Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { OnboardingForm, OnboardingFormApiResponse } from "@/types/admin/onboarding-form";
import { ApiResponse } from "@/types/shared/api";

interface OnboardingFormArchiveButtonProperties {
  onboardingForm: OnboardingForm;
  className?: string;
}

export default function OnboardingFormArchiveButton({
  onboardingForm,
  className,
}: OnboardingFormArchiveButtonProperties) {
  const request = useRequest();

  const isPublished = onboardingForm.status === "published";
  const isArchived = onboardingForm.status === "archived";
  const isDraft = onboardingForm.status === "draft";
  const canArchive = isPublished || isArchived;
  const isLoading = request.loading;

  const handleArchiveToggle = () => {
    if (!canArchive || isLoading) return;

    const newStatus = isPublished ? "archived" : "published";

    request.patch(
      ENDPOINTS.ADMIN.ONBOARDING_FORMS.STATUS(onboardingForm.id),
      { status: newStatus },
      {
        tanstack: {
          invalidateQueries: ["admin-onboarding-forms"],
          mutationOptions: {
            onSuccess: () => {
              // Optimistic cache update for list
              request.queryCache.setQueryData<OnboardingFormApiResponse>(
                ["admin-onboarding-forms"],
                (previous) => {
                  if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                    return previous;
                  }

                  return {
                    ...previous,
                    data: previous.data.map((form) =>
                      form.id === onboardingForm.id ? { ...form, status: newStatus } : form,
                    ),
                  } as OnboardingFormApiResponse;
                },
                { all: true },
              );

              // Update the specific onboarding form cache if available
              request.queryCache.setQueryData<ApiResponse<OnboardingForm> | undefined>(
                ["admin-onboarding-form", String(onboardingForm.id)],
                (previous) => {
                  if (!previous || previous.status !== "success") {
                    return previous;
                  }

                  return {
                    ...previous,
                    data: { ...previous.data, status: newStatus as OnboardingForm["status"] },
                  } as ApiResponse<OnboardingForm>;
                },
                { all: true },
              );

              toast.success(
                `Onboarding form ${
                  newStatus === "archived" ? "archived" : "restored to published"
                } successfully.`,
              );
            },
            onError: (error) => {
              toast.error(error.message);
            },
          },
        },
      },
    );
  };

  const disabledReason = isDraft
    ? "Draft onboarding forms cannot be archived. Publish the form first to enable archiving."
    : undefined;

  return (
    <DisabledTooltip reason={disabledReason}>
      <Button
        variant="outline"
        className={`hover:bg-accent/10! group hover:text-accent! hover:ring-none! flex w-full cursor-pointer! items-center justify-start gap-1.5 border-none! text-sm font-medium text-gray-700 shadow-none disabled:hover:bg-transparent! disabled:hover:text-inherit! ${className ?? ""}`}
        onClick={handleArchiveToggle}
        disabled={!canArchive || isLoading}
        aria-label={
          isArchived ? "Restore onboarding form to published" : "Move onboarding form to archive"
        }
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin transition-colors duration-150" />
        ) : (
          <Archive className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
        )}
        <span>{isArchived ? "Restore to Published" : "Move to Archive"}</span>
      </Button>
    </DisabledTooltip>
  );
}
