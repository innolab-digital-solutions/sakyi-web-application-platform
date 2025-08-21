import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";
import AdminMenu from "./admin-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export function AdminHeader() {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur border-b border-border/80">
      <div className="flex h-16 items-center justify-between px-5">
        <div className="flex h-5 items-center">
          <SidebarTrigger
            variant="outline"
            className="h-9 w-9 hover:!border-primary"
          />

          <Separator orientation="vertical" className="mx-3 hidden sm:block" />

          <div className="hidden sm:block">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Admin Control Panel</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard & Insights</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/"
                      className=" text-foreground hover:!text-accent"
                    >
                      Overview
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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

          <AdminMenu />
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
