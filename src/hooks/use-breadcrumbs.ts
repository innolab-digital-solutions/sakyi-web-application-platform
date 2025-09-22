import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { type BreadcrumbItem, getBreadcrumbsForPath } from "@/lib/config/breadcrumbs";

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    return getBreadcrumbsForPath(pathname);
  }, [pathname]);

  return breadcrumbs;
};
