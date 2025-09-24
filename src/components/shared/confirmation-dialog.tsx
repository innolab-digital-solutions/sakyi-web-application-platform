import { LogOut } from "lucide-react";

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

interface ConfirmationDialogProperties {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
}

export default function LogoutConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: ConfirmationDialogProperties) {
  const handleOpenChange = (open: boolean) => {
    if (!open && !isLoading) {
      onClose();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <LogOut className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <AlertDialogTitle className="text-center text-xl font-semibold">
            Sign Out Confirmation
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center leading-relaxed">
            Are you sure you want to sign out of your account? You&apos;ll need to log in again to
            access the dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel
            onClick={onClose}
            disabled={isLoading}
            className="w-full cursor-pointer hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Stay Signed In
          </AlertDialogCancel>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full cursor-pointer bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:bg-red-700 dark:hover:bg-red-800"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Signing Out...
              </div>
            ) : (
              <div className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </div>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
