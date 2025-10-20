"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { adminNavigation } from "@/config/navigation";
import { useAuth } from "@/context/auth-context";
import {
  filterNavByPermission,
  getActiveAdminNav,
  isAdminListPage,
} from "@/utils/admin/navigation";
import { cn } from "@/utils/shared/cn";
import { addDefaultListParameters } from "@/utils/shared/parameters";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { can } = useAuth();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (name: string) => {
    setOpenGroups((previous) => ({
      ...previous,

      [name]: !previous[name],
    }));
  };

  const filtered = filterNavByPermission(adminNavigation, can);

  const items = getActiveAdminNav(pathname, filtered);

  // Helper function to get href with default parameters for admin list pages
  const getHref = useCallback((path: string): string => {
    return isAdminListPage(path) ? addDefaultListParameters(path) : path;
  }, []);

  useEffect(() => {
    const activeGroups: Record<string, boolean> = {};

    const updatedItems = getActiveAdminNav(pathname, adminNavigation);
    for (const group of updatedItems) {
      for (const item of group.items) {
        if (item.active) {
          activeGroups[item.name] = true;
        }
      }
    }

    setOpenGroups((previous) => ({ ...previous, ...activeGroups }));
  }, [pathname]);

  return (
    <Sidebar className="border-border/40 border-r">
      <SidebarHeader className="border-border/80 border-b py-[13px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2">
              <div className="border-border/40 relative h-9 w-9 overflow-hidden rounded-sm border shadow">
                <Image
                  src="/images/logo.jpg"
                  alt="logo"
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-semibold tracking-tight">SaKyi Health & Wellness</h3>
                <p className="text-muted-foreground text-xs font-medium">
                  Platform-Wide Control Panel
                </p>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {items.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <div key={item.name} className="space-y-1">
                    {item.subitems && item.subitems.length > 0 ? (
                      <>
                        <SidebarMenuItem>
                          <button
                            onClick={() => toggleGroup(item.name)}
                            className="hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-sm px-3 py-2 transition-colors"
                          >
                            <div className="flex items-center">
                              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                              <span className="text-[12.8px] font-medium">{item.name}</span>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                openGroups[item.name] && "rotate-180",
                              )}
                            />
                          </button>
                        </SidebarMenuItem>
                        <div
                          className={cn(
                            "grid transition-all duration-200 ease-in-out",
                            openGroups[item.name]
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0",
                          )}
                        >
                          <div className="overflow-hidden">
                            <div className="ml-4 space-y-1 border-l py-1 pl-2">
                              {item.subitems &&
                                item.subitems.map((subitem) => (
                                  <SidebarMenuItem key={subitem.name}>
                                    <Link
                                      href={getHref(subitem.path)}
                                      className={cn(
                                        "hover:bg-accent hover:text-accent-foreground flex items-center rounded-sm px-3 py-2 text-sm transition-colors",
                                        subitem.active && "bg-accent text-accent-foreground",
                                      )}
                                    >
                                      <span className="text-[12.8px] font-medium">
                                        {subitem.name}
                                      </span>
                                    </Link>
                                  </SidebarMenuItem>
                                ))}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <SidebarMenuItem>
                        <Link
                          href={getHref(item.path)}
                          className={cn(
                            "hover:bg-accent hover:text-accent-foreground flex items-center rounded-sm px-3 py-2 transition-colors",
                            item.active && "bg-accent text-accent-foreground",
                          )}
                        >
                          {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                          <span className="text-[12.8px] font-medium">{item.name}</span>
                        </Link>
                      </SidebarMenuItem>
                    )}
                  </div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
