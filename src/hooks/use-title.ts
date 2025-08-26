import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";

export function useTitle(): string {
  const breadcrumbs = useBreadcrumbs();
  return breadcrumbs[breadcrumbs.length - 1]?.label || "Overview";
}
