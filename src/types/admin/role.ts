import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface Permission {
  [module: string]: {
    [action: string]: string;
  };
}

export interface Role {
  id: number;
  name: string;
  description: string | null;
  permissions: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface RolesResponse {
  status: string;
  message: string;
  data: Role[];
  meta: {
    pagination: Pagination;
  };
}

export type RoleApiResponse = ApiResponse<RolesResponse>;
