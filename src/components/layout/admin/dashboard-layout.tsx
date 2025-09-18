"use client";

import { usePathname } from "next/navigation";

import AuthGuard from "@/components/auth/auth-guard";
import AuthHeadersProvider from "@/components/auth/auth-headers-provider";
import LoginRedirect from "@/components/auth/login-redirect";
import DashboardHeader from "@/components/layout/admin/dashboard-header";
import DashboardSidebar from "@/components/layout/admin/dashboard-sidebar";
import NoSSR from "@/components/no-ssr";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ADMIN } from "@/config/routes";
import { AuthProvider } from "@/context/auth-context";

export default function DashboardLayout({
  children,
  defaultOpen,
}: {
  children: React.ReactNode;
  defaultOpen: boolean;
}) {
  const pathname = usePathname();

  if (pathname === ADMIN.LOGIN) {
    return (
      <>
        <AuthProvider>
          <AuthHeadersProvider />
          <LoginRedirect>{children}</LoginRedirect>
        </AuthProvider>
      </>
    );
  }

  return (
    <AuthProvider>
      <AuthHeadersProvider />
      <NoSSR fallback={<div className="min-h-screen bg-gray-50" />}>
        <AuthGuard requireAuth={true}>
          <SidebarProvider defaultOpen={defaultOpen}>
            <DashboardSidebar />
            <SidebarInset>
              <DashboardHeader />
              <div className="flex flex-1 flex-col p-5">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </AuthGuard>
      </NoSSR>
    </AuthProvider>
  );
}
