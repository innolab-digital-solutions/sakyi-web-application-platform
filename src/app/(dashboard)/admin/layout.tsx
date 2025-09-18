import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import DashboardLayout from "@/components/layout/admin/dashboard-layout";

const inter = Inter({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <div className={`${inter.className} min-h-screen`}>
      <DashboardLayout defaultOpen={defaultOpen}>{children}</DashboardLayout>
    </div>
  );
}
