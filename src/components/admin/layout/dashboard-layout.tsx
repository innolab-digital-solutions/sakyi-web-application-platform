"use client";

import { usePathname } from "next/navigation";
import React from "react";

import AccessControl from "@/components/admin/layout/access-control";
import DashboardHeader from "@/components/admin/layout/dashboard-header";
import DashboardSidebar from "@/components/admin/layout/dashboard-sidebar";
import NoSSR from "@/components/shared/no-ssr";
import { QueryProvider } from "@/components/shared/query-provider";
import PageTransition from "@/components/shared/transitions/page-transition";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PATHS } from "@/config/paths";
import { AuthProvider } from "@/context/auth-context";
import { TransitionProvider } from "@/context/transition-context";

interface DashboardLayoutProperties {
  children: React.ReactNode;
  defaultOpen: boolean;
}

export default function DashboardLayout({ children, defaultOpen }: DashboardLayoutProperties) {
  const pathname = usePathname();
  const isLoginPage = pathname === PATHS.ADMIN.LOGIN;

  return (
    <QueryProvider>
      <AuthProvider>
        <TransitionProvider defaultTransition="scale">
          <AccessControl requireAuth={!isLoginPage} checkPermissions={!isLoginPage}>
            {isLoginPage ? (
              children
            ) : (
              <NoSSR fallback={<div className="min-h-screen bg-gray-50" />}>
                <SidebarProvider defaultOpen={defaultOpen}>
                  {/* Sidebar */}
                  <DashboardSidebar />

                  {/* Main Content */}
                  <SidebarInset className="flex min-w-0 flex-1 flex-col">
                    <DashboardHeader />
                    <div className="flex flex-1 flex-col p-6">
                      <PageTransition transitionType="scale">{children}</PageTransition>
                    </div>
                  </SidebarInset>
                </SidebarProvider>
              </NoSSR>
            )}
          </AccessControl>
        </TransitionProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
