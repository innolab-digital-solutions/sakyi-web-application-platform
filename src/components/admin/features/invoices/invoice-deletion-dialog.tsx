import { FileQuestionMark, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { Invoice } from "@/types/admin/invoice";
import { cn } from "@/utils/shared/cn";

interface InvoiceDeletionDialogProperties {
  invoice: Invoice;
  className?: string;
}

export default function InvoiceDeletionDialog({
  invoice,
  className,
}: InvoiceDeletionDialogProperties) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const request = useRequest();

  const closeDeleteDialog = () => setShowDeleteDialog(false);

  const handleDeleteConfirm = () => {
    request.del(ENDPOINTS.ADMIN.INVOICES.DESTROY(invoice.id), {
      tanstack: {
        invalidateQueries: ["admin-invoices"],
        mutationOptions: {
          onSuccess: () => {
            closeDeleteDialog();
            toast.success("Invoice deleted successfully.");
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
        const isDeletable = Boolean(invoice.actions?.deletable);
        const isDisabled = isLoading || !isDeletable;
        let disabledReason: string | undefined;
        if (isLoading) {
          disabledReason = "Deleting in progress. Please wait.";
        } else if (!isDeletable) {
          disabledReason = "You don't have permission to delete this invoice.";
        }

        return (
          <DisabledTooltip reason={disabledReason}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "hover:bg-destructive/10 hover:text-destructive text-destructive flex cursor-pointer items-center justify-center text-sm font-semibold",
                className,
              )}
              disabled={isDisabled}
              onClick={() => (isDeletable ? setShowDeleteDialog(true) : undefined)}
              aria-label="Delete invoice"
            >
              <Trash2 className="h-2 w-2" />
              <span>Delete</span>
            </Button>
          </DisabledTooltip>
        );
      })()}

      <ConfirmationDialog
        title="Delete Invoice Confirmation"
        description={`Permanently delete the invoice "${invoice.invoice_number}"? This action cannot be undone.`}
        icon={FileQuestionMark}
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
