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
  disabled?: boolean;
};

export default function FormDialog({
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
  disabled = false,
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && event.target instanceof HTMLElement) {
      const isTextarea = event.target.tagName === "TEXTAREA";
      const targetElement = event.target as HTMLElement;
      const isSubmitButton =
        (targetElement instanceof HTMLButtonElement && targetElement.type === "submit") ||
        targetElement.closest('button[type="submit"]') !== null;

      if (!isTextarea && !isSubmitButton) {
        event.preventDefault();
      }
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : undefined}
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[98vh] w-[95vw] max-w-md flex-col rounded-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        <form
          onSubmit={onSubmit}
          onKeyDown={handleKeyDown}
          className="flex min-h-0 w-full flex-1 flex-col p-2"
        >
          <DialogHeader className="flex-shrink-0 !gap-1">
            <DialogTitle className="text-md !mb-0 flex items-center !p-0 font-bold">
              {icon && <div className="mr-1.5">{icon}</div>}
              {title}
            </DialogTitle>

            {description ? (
              <DialogDescription className="text-muted-foreground !p-0 text-sm font-medium">
                {description}
              </DialogDescription>
            ) : undefined}
          </DialogHeader>

          <div className="scrollbar-hide min-h-0 flex-1 space-y-5 overflow-y-auto px-1 py-5">
            {children}
          </div>

          <DialogFooter className="flex flex-shrink-0 items-center space-x-1 py-1">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={processing}
                className="cursor-pointer bg-gray-100 hover:bg-gray-50 hover:text-gray-800"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              type="submit"
              variant="default"
              disabled={processing || disabled}
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
