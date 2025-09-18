"use client";

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
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import LogoutConfirmationDialog from "@/features/auth/components/logout-confirmation-dialog";
import { useState } from "react";

export default function UserMenu() {
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
      // Wait for the complete logout process including API call
      await logout();
      // Dialog will close after logout completes (user gets redirected)
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Only show skeleton during initial loading, not during logout
  if (loading && !isAuthenticated) {
    return <Skeleton className="h-8 w-8 rounded-full bg-muted" />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userInitials = user.username
    ? user.username.substring(0, 2).toUpperCase()
    : "U";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.username || "User"} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm leading-none font-medium">
                {user.username || "User"}
              </p>
              <p className="text-muted-foreground text-xs leading-none">
                {user.email || "No email"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={openLogoutDialog}
            className="cursor-pointer text-white !bg-destructive hover:!bg-destructive hover:!text-white"
          >
            <LogOut className="mr-2 h-4 w-4 text-white" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LogoutConfirmationDialog
        isOpen={showLogoutDialog}
        onClose={closeLogoutDialog}
        onConfirm={handleLogoutConfirm}
        isLoading={loading}
      />
    </>
  );
}
