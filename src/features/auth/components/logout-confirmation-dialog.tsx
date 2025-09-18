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
import { LogOut } from "lucide-react";

interface LogoutConfirmationDialogProps {
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
}: LogoutConfirmationDialogProps) {
    const handleOpenChange = (open: boolean) => {
        if (!open && !isLoading) {
            onClose();
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader className="space-y-4">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full dark:bg-red-900/20">
                        <LogOut className="w-6 h-6 text-red-600 dark:text-red-500" />
                    </div>
                    <AlertDialogTitle className="text-center text-xl font-semibold">
                        Sign Out Confirmation
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center leading-relaxed">
                        Are you sure you want to sign out of your account? You&apos;ll need
                        to log in again to access the dashboard.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                    <AlertDialogCancel
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full sm:w-auto hover:bg-gray-100 hover:text-gray-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Stay Signed In
                    </AlertDialogCancel>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Signing Out...
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </div>
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
