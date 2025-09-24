export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Breadcrumbs {
  [key: string]: BreadcrumbItem[];
}

export interface BreadcrumbProperties {
  className?: string;
  separator?: React.ReactNode;
  maxItems?: number;
}
