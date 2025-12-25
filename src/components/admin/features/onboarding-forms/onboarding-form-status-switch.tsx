"use client";

import React from "react";
import { toast } from "sonner";

import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { OnboardingForm, OnboardingFormApiResponse } from "@/types/admin/onboarding-form";

interface OnboardingFormStatusSwitchProperties {
  onboardingForm: OnboardingForm;
}

export default function OnboardingFormStatusSwitch({
  onboardingForm,
}: OnboardingFormStatusSwitchProperties) {
  const request = useRequest();

  const isDraft = onboardingForm.status === "draft";
  const isPublished = onboardingForm.status === "published";
  const canToggle = isDraft || isPublished;

  const handleToggle = (checked: boolean) => {
    if (!canToggle) return;

    const newStatus = checked ? "published" : "draft";

    request.patch(
      ENDPOINTS.ADMIN.ONBOARDING_FORMS.STATUS(onboardingForm.id),
      { status: newStatus },
      {
        tanstack: {
          invalidateQueries: ["admin-onboarding-forms"],
          mutationOptions: {
            onSuccess: () => {
              // Optimistic cache update
              request.queryCache.setQueryData<OnboardingFormApiResponse>(
                ["admin-onboarding-forms"],
                (previous) => {
                  if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                    return previous;
                  }

                  return {
                    ...previous,
                    data: previous.data.map((f) =>
                      f.id === onboardingForm.id
                        ? {
                            ...f,
                            status: newStatus,
                            published_at:
                              newStatus === "published" ? new Date().toISOString() : undefined,
                          }
                        : f,
                    ),
                  } as OnboardingFormApiResponse;
                },
                { all: true },
              );

              // Update the specific form cache if available
              request.queryCache.setQueryData(
                ["admin-onboarding-form", String(onboardingForm.id)],
                (previous: unknown) => {
                  if (
                    !previous ||
                    typeof previous !== "object" ||
                    !("status" in previous) ||
                    (previous as { status: string }).status !== "success"
                  ) {
                    return previous;
                  }
                  const previous_ = previous as {
                    status: string;
                    data: OnboardingForm;
                    message?: string;
                  };
                  return {
                    ...previous_,
                    data: {
                      ...previous_.data,
                      status: newStatus,
                      published_at:
                        newStatus === "published" ? new Date().toISOString() : undefined,
                    },
                  };
                },
                { all: true },
              );

              toast.success(
                `Onboarding form ${newStatus === "published" ? "published" : "moved to draft"} successfully.`,
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

  if (!canToggle) {
    return;
  }

  const tooltipText = isPublished ? "Click to move form to draft status" : "Click to publish form";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Switch
            checked={isPublished}
            onCheckedChange={handleToggle}
            disabled={request.loading}
            aria-label={`Toggle onboarding form ${onboardingForm.title} to ${isPublished ? "draft" : "published"}`}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent className="bg-popover text-popover-foreground border-border max-w-xs rounded-md border px-3 py-2 shadow-lg">
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
