import { Permission } from "@/types/admin/permission";
import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface Role {
  id: number;
  name: string;
  description: string | null;
  has_permissions: boolean;
  permissions: Permission | Permission[];
  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

export interface RolesResponse {
  status: string;
  message: string;
  data: Role[];
  meta: {
    pagination: Pagination;
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
