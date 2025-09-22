import { LucideIcon } from "lucide-react";

export interface SubItem {
  name: string;
  path: string;
  params: Record<string, string>;
  active: boolean;
  allow: boolean;
}

export interface NavItem {
  name: string;
  icon?: LucideIcon;
  path: string;
  params?: Record<string, string>;
  active: boolean;
  allow?: boolean;
  subitems?: SubItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}
