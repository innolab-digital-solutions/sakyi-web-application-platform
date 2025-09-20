import { Bell, Search } from "lucide-react";

import DynamicBreadcrumb from "@/components/dynamic-breadcrumb";
import UserMenu from "@/components/layout/admin/user-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-border/80 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="flex h-16 items-center justify-between px-5">
        <div className="flex h-5 items-center">
          <SidebarTrigger variant="outline" className="hover:!border-primary h-9 w-9" />

          <Separator orientation="vertical" className="mx-3 hidden sm:block" />

          <div className="hidden sm:block">
            <DynamicBreadcrumb />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <Button variant="outline" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </div>

            <div>
              <Button variant="outline" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
