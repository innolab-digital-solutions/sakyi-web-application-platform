import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar, AdminHeader } from "@/components/admin/layout";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";

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
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminSidebar />
        <SidebarInset>
          <AdminHeader />
          <div className="flex flex-1 flex-col p-5">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
