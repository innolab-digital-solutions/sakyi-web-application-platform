"use client";

import { usePathname } from "next/navigation";

import DashboardHeader from "@/components/admin/layout/dashboard-header";
import DashboardSidebar from "@/components/admin/layout/dashboard-sidebar";
import AuthGuard from "@/components/auth/auth-guard";
import AuthHeadersProvider from "@/components/auth/auth-headers-provider";
import LoginRedirect from "@/components/auth/login-redirect";
import NoSSR from "@/components/shared/no-ssr";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PATHS } from "@/config/paths";
import { AuthProvider } from "@/context/auth-context";

interface DynamicDashboardLayoutProperties {
  children: React.ReactNode;
  defaultOpen: boolean;
}

export default function DynamicDashboardLayout(properties: DynamicDashboardLayoutProperties) {
  const pathname = usePathname();

  if (pathname === PATHS.ADMIN.LOGIN) {
    return (
      <>
        <AuthProvider>
          <AuthHeadersProvider />
          <LoginRedirect>{properties.children}</LoginRedirect>
        </AuthProvider>
      </>
    );
  }

  return (
    <AuthProvider>
      <AuthHeadersProvider />
      <NoSSR fallback={<div className="min-h-screen bg-gray-50" />}>
        <AuthGuard requireAuth={true}>
          <SidebarProvider defaultOpen={properties.defaultOpen}>
            <DashboardSidebar />
            <SidebarInset>
              <DashboardHeader />
              <div className="flex flex-1 flex-col p-5">{properties.children}</div>
            </SidebarInset>
          </SidebarProvider>
        </AuthGuard>
      </NoSSR>
    </AuthProvider>
  );
}
