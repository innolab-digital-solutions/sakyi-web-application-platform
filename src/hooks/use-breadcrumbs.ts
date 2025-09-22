import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { BreadcrumbItem } from "@/types/shared/breadcrumb";
import { getBreadcrumbsForPath } from "@/utils/shared/breadcrumb";

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    return getBreadcrumbsForPath(pathname);
  }, [pathname]);

  return breadcrumbs;
};
