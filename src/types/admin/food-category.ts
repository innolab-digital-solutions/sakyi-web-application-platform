export interface FoodCategory {
  id: number;
  name: string;
  description?: string | null;
  parent_id?: number | null;
  parent?: {
    id: number;
    name: string;
    parent_id?: number | null;
  };
  created_at?: string;
  updated_at?: string;
  categories?: { id: number; name: string; parent_id?: number }[];
}

// types/admin/food-category.ts

export interface FoodCategoryFormProperties {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: {
    id?: number;
    name?: string;
    description?: string;
    parent_id?: number | null;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;

  categories?: { id: number; name: string; parent_id?: number }[];
}
