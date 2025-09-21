export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface BreadcrumbConfig {
  [key: string]: BreadcrumbItem[];
}
