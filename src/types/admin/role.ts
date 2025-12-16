import { Permission } from "@/types/admin/permission";
import { ApiResponse } from "@/types/shared/api";

export interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions: Permission | Permission[];
  actions: {
    edit: {
      allowed: boolean;
      reasons: string[];
    };
    delete: {
      allowed: boolean;
      reasons: string[];
    };
  };
}

export type RoleApiResponse = ApiResponse<Role[]> | undefined;

export type RoleFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<Role>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
};
