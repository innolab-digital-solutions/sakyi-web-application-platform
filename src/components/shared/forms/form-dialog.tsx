"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

type FormDialogProperties = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  processing?: boolean;
  isEdit?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
};

export function FormDialog({
  trigger,
  open,
  onOpenChange,
  onClose,
  title,
  description,
  icon,
  children,
  onSubmit,
  processing = false,
  isEdit = false,
  submitLabel,
  submittingLabel,
}: FormDialogProperties) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = typeof open === "boolean" && typeof onOpenChange === "function";
  const dialogOpen = isControlled ? open : uncontrolledOpen;

  const handleOpenChange = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setUncontrolledOpen(value);
    }

    if (!value) onClose?.();
  };

  const derivedSubmitLabel = submitLabel ?? (isEdit ? "Save Changes" : "Create");
  const derivedSubmittingLabel = submittingLabel ?? (isEdit ? "Saving Changes..." : "Creating...");

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : undefined}
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        <form onSubmit={onSubmit} className="w-full p-2.5">
          <DialogHeader>
            <DialogTitle className="text-md mb-1 flex items-center gap-2 font-bold">
              {icon}
              {title}
            </DialogTitle>
            {description ? (
              <DialogDescription className="text-muted-foreground text-sm font-medium">
                {description}
              </DialogDescription>
            ) : undefined}
          </DialogHeader>

          <div className="space-y-5 py-5">{children}</div>

          <DialogFooter className="flex items-center space-x-1">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={processing}
                className="cursor-pointer hover:bg-gray-100 hover:text-gray-800"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              variant="default"
              disabled={processing}
              className="flex cursor-pointer items-center gap-2 font-semibold"
            >
              {processing ? (
                <>
                  <Spinner />
                  {derivedSubmittingLabel}
                </>
              ) : (
                <>
                  {icon}
                  {derivedSubmitLabel}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
