"use client";

import { LucideIcon } from "lucide-react";
import React from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/shared/cn";

export type ConfirmationVariant = "default" | "destructive" | "warning" | "success";

interface ConfirmationDialogProperties {
  // Core functionality
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;

  // Content customization
  title: string;
  description: string;
  icon?: LucideIcon;

  // Button customization
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;

  // Advanced customization
  showIcon?: boolean;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  preventCloseOnLoading?: boolean;

  // Custom styling
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const variantStyles: Record<
  ConfirmationVariant,
  {
    iconBg: string;
    iconColor: string;
    confirmButton: string;
  }
> = {
  default: {
    iconBg: "bg-blue-100 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-500",
    confirmButton:
      "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800",
  },
  destructive: {
    iconBg: "bg-red-100 dark:bg-red-900/20",
    iconColor: "text-red-600 dark:text-red-500",
    confirmButton:
      "bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800",
  },
  warning: {
    iconBg: "bg-yellow-100 dark:bg-yellow-900/20",
    iconColor: "text-yellow-600 dark:text-yellow-500",
    confirmButton:
      "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 dark:bg-yellow-700 dark:hover:bg-yellow-800",
  },
  success: {
    iconBg: "bg-green-100 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-500",
    confirmButton:
      "bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800",
  },
};

const maxWidthClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
};

export default function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  description,
  icon: Icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  showIcon = true,
  maxWidth = "md",
  preventCloseOnLoading = true,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
}: ConfirmationDialogProperties) {
  const styles = variantStyles[variant];

  const handleOpenChange = (open: boolean) => {
    if (!open && !(preventCloseOnLoading && isLoading)) {
      onClose();
    }
  };

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Confirmation action failed:", error);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className={cn(maxWidthClasses[maxWidth], className)}>
        <AlertDialogHeader className="">
          {showIcon && Icon && (
            <div
              className={cn(
                "mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-md",
                styles.iconBg,
                iconClassName,
              )}
            >
              <Icon className={cn("h-6 w-6", styles.iconColor)} />
            </div>
          )}

          <AlertDialogTitle
            className={cn("text-center text-lg font-bold text-gray-800", titleClassName)}
          >
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription
            className={cn(
              "text-muted-foreground text-center text-sm leading-relaxed font-medium",
              descriptionClassName,
            )}
          >
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col-reverse gap-3 py-2 sm:flex-row sm:justify-center">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isLoading}
            className="w-full cursor-pointer bg-transparent !font-medium text-gray-800 hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {cancelText}
          </AlertDialogCancel>

          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={cn(
              "w-full cursor-pointer !font-medium disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto",
              styles.confirmButton,
            )}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center">{confirmText}</div>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
