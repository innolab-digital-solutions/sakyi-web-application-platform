import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  getBreadcrumbsForPath,
  type BreadcrumbItem,
} from "@/config/breadcrumbs";

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    return getBreadcrumbsForPath(pathname);
  }, [pathname]);

  return breadcrumbs;
}
