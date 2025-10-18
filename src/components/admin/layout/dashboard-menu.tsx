"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

import ConfirmationDialog from "@/components/shared/confirmation-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/auth-context";

export default function DashboardMenu() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const openLogoutDialog = () => setShowLogoutDialog(true);

  const closeLogoutDialog = () => {
    if (!loading) {
      setShowLogoutDialog(false);
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading && !isAuthenticated) {
    return <Skeleton className="bg-muted h-8 w-8 rounded-full" />;
  }

  if (!isAuthenticated || !user) {
    return;
  }

  const userInitials = user.username ? user.username.slice(0, 2).toUpperCase() : "U";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="focus:!border-border border-border relative h-9 w-9 cursor-pointer overflow-hidden rounded-full border !p-0 hover:!bg-transparent focus:!ring-0"
          >
            <Avatar className="!h-full !w-full">
              <AvatarImage src={user.avatar} alt={user.username || "User"} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">{user.username || "User"}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {user.email || "No email"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={openLogoutDialog}
            className="!bg-destructive hover:!bg-destructive cursor-pointer text-white hover:!text-white"
          >
            <LogOut className="mr-2 h-4 w-4 text-white" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        title="Sign Out Confirmation"
        description="Are you sure you want to sign out of your account? You'll need to log in again to access the dashboard."
        icon={LogOut}
        variant="destructive"
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        processingText="Signing you out..."
        isOpen={showLogoutDialog}
        onClose={closeLogoutDialog}
        onConfirm={handleLogoutConfirm}
        isLoading={loading}
      />
    </>
  );
}
