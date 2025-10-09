import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import DashboardLayout from "@/components/admin/layout/dashboard-layout";
import PermissionGuard from "@/components/admin/layout/permission-guard";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className={`${inter.className} min-h-screen`}>
      <DashboardLayout defaultOpen={defaultOpen}>
        <PermissionGuard>{children}</PermissionGuard>
      </DashboardLayout>

      <Toaster position="top-right" richColors />
    </div>
  );
}
