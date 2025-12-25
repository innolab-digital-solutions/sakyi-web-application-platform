import { Trash2, TriangleAlert } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { PaymentMethod, PaymentMethodApiResponse } from "@/types/admin/payment-method";
import { cn } from "@/utils/shared/cn";

interface PaymentMethodDeletionDialogProperties {
  paymentMethod: PaymentMethod;
  className?: string;
}

export default function PaymentMethodDeletionDialog({
  paymentMethod,
  className,
}: PaymentMethodDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const request = useRequest();

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.PAYMENT_METHODS.DESTROY(paymentMethod.id), {
      tanstack: {
        invalidateQueries: ["admin-payment-methods"],
        mutationOptions: {
          onSuccess: () => {
            // Optimistic cache update - remove deleted payment method from list
            request.queryCache.setQueryData<PaymentMethodApiResponse>(
              ["admin-payment-methods"],
              (previous) => {
                if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                  return previous;
                }

                return {
                  ...previous,
                  data: previous.data.filter((m) => m.id !== paymentMethod.id),
                } as PaymentMethodApiResponse;
              },
              { all: true },
            );

            closeDeleteDialog();
            toast.success("Payment method deleted successfully.");
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      },
    });
  };

  return (
    <>
      {(() => {
        const isLoading = request.loading;
        const deleteAllowed = Boolean(paymentMethod.actions?.delete?.allowed);
        const deleteReasons = paymentMethod.actions?.delete?.reasons ?? [];
        const isDisabled = isLoading || !deleteAllowed;

        let disabledReason: string | undefined;
        if (isLoading) {
          disabledReason = "Deleting in progress. Please wait.";
        } else if (!deleteAllowed && deleteReasons.length > 0) {
          disabledReason = deleteReasons[0]?.trim() || undefined;
        }

        return (
          <DisabledTooltip reason={disabledReason}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-destructive/10 hover:text-destructive text-destructive flex cursor-pointer items-center justify-center text-sm font-semibold disabled:pointer-events-auto! disabled:cursor-help disabled:bg-transparent",
                className,
              )}
              disabled={isDisabled}
              onClick={() => (deleteAllowed ? setShowDeleteDialog(true) : undefined)}
              aria-label="Delete payment method"
            >
              <Trash2 className="h-2 w-2" />
              <span>Delete</span>
            </Button>
          </DisabledTooltip>
        );
      })()}

      <ConfirmationDialog
        title="Delete Payment Method"
        description={`Permanently delete the payment method "${paymentMethod.name}"? This action cannot be undone.`}
        icon={TriangleAlert}
        variant="destructive"
        confirmText="Yes, Delete It"
        cancelText="No, Keep It"
        isOpen={showDeleteDialog}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        isLoading={request.loading}
      />
    </>
  );
}
