import { Archive, ArchiveRestore, FileQuestion } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { OnboardingForm, OnboardingFormApiResponse } from "@/types/admin/onboarding-form";

interface OnboardingFormStatusDialogProperties {
  onboardingForm: OnboardingForm;
  className?: string;
}

export default function OnboardingFormStatusDialog({
  onboardingForm,
  className,
}: OnboardingFormStatusDialogProperties) {
  const [showDialog, setShowDialog] = useState(false);

  const closeDialog = () => setShowDialog(false);

  const request = useRequest();

  const isDraft = onboardingForm.status === "draft";
  const isPublished = onboardingForm.status === "published";
  const isArchived = onboardingForm.status === "archived";
  const restoreToPublished = Boolean(onboardingForm.published_at);

  // Lifecycle flow: Draft → Published → Archived
  // Only allow archiving if status is "published"
  // Draft forms cannot be archived directly
  const canArchive = isPublished;
  const canRestore = isArchived;

  // Don't render if form is draft (drafts cannot be archived)
  // Lifecycle flow: Draft → Published → Archived
  if (isDraft || (!canArchive && !canRestore)) {
    return <></>;
  }

  const handleStatusChange = (newStatus: "archived" | "draft" | "published") => {
    request.patch(
      ENDPOINTS.ADMIN.ONBOARDING_FORMS.CHANGE_STATUS(onboardingForm.id),
      { status: newStatus },
      {
        tanstack: {
          invalidateQueries: ["admin-onboarding-forms", "admin-onboarding-form"],
          mutationOptions: {
            onSuccess: () => {
              request.queryCache.setQueryData<OnboardingFormApiResponse>(
                ["admin-onboarding-forms"],
                (previous) => {
                  if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                    return previous;
                  }

                  return {
                    ...previous,
                    data: previous.data.map((f) =>
                      f.id === onboardingForm.id ? { ...f, status: newStatus } : f,
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
                    data: { ...previous_.data, status: newStatus },
                  };
                },
                { all: true },
              );

              closeDialog();
              if (isArchived) {
                toast.success(
                  `Onboarding form restored to ${newStatus === "draft" ? "draft" : "published"} successfully.`,
                );
              } else {
                toast.success("Onboarding form archived successfully.");
              }
            },
            onError: (error) => {
              toast.error(error.message);
            },
          },
        },
      },
    );
  };

  const handleArchive = () => {
    handleStatusChange("archived");
  };

  const handleRestore = () => {
    const restoreStatus = restoreToPublished ? "published" : "draft";
    handleStatusChange(restoreStatus);
  };

  const buttonText = isArchived ? "Restore Form" : "Archive Form";
  const ButtonIcon = isArchived ? ArchiveRestore : Archive;
  const buttonAriaLabel = isArchived ? "Restore form" : "Archive form";

  // Dialog configuration based on action
  const dialogTitle = isArchived ? "Restore Form" : "Archive Form";
  const dialogDescription = isArchived
    ? restoreToPublished
      ? `Restore "${onboardingForm.title}" to published status? The form will be moved out of the archive and become visible to users again.`
      : `Restore "${onboardingForm.title}" to draft status? The form will be moved out of the archive but remain hidden from public view.`
    : `Archive "${onboardingForm.title}"? The form will be moved to the archive and hidden from public view. You can restore it later to draft or published status.`;
  const confirmText = isArchived
    ? restoreToPublished
      ? "Restore to Published"
      : "Restore to Draft"
    : "Yes, Archive It";
  const cancelText = "Cancel";
  const processingText = isArchived ? "Restoring..." : "Archiving...";
  const variant = isArchived ? "default" : "warning";

  return (
    <>
      {(() => {
        const isLoading = request.loading;
        const isDisabled = isLoading;
        const disabledReason = isLoading
          ? isArchived
            ? "Restoring in progress. Please wait."
            : "Archiving in progress. Please wait."
          : undefined;

        return (
          <DisabledTooltip reason={disabledReason}>
            <Button
              variant="outline"
              className={`hover:!bg-accent/10 group hover:!text-accent hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium text-gray-700 shadow-none ${className ?? ""}`}
              onClick={() => setShowDialog(true)}
              disabled={isDisabled}
              type="button"
              aria-label={buttonAriaLabel}
            >
              <ButtonIcon className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
              <span>{buttonText}</span>
            </Button>
          </DisabledTooltip>
        );
      })()}

      <ConfirmationDialog
        title={dialogTitle}
        description={dialogDescription}
        icon={FileQuestion}
        variant={variant}
        confirmText={confirmText}
        cancelText={cancelText}
        processingText={processingText}
        isOpen={showDialog}
        onClose={closeDialog}
        onConfirm={isArchived ? handleRestore : handleArchive}
        isLoading={request.loading}
        maxWidth="md"
      />
    </>
  );
}
