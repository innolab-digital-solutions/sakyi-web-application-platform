import { LucideIcon } from "lucide-react";

export interface SubItem {
  name: string;
  path: string;
  params: Record<string, string>;
  active: boolean;
  permission: string;
}

export interface NavItem {
  name: string;
  icon?: LucideIcon;
  path: string;
  params?: Record<string, string>;
  active: boolean;
  permission?: string;
  subitems?: SubItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
