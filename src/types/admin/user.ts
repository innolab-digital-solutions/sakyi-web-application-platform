import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export type AuthProvider = "google" | "facebook";

export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  module: string;
  actions: string[];
}

export interface UserProfile {
  id: number;
  user_id: number;
  username?: string | null;
  picture?: string | null;
  dob?: string | null; // ISO date string
  gender?: "male" | "female" | null;
  address?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface User {
  id: number;
  roles: Role[];
  permissions?: Permission[];
  provider_id?: string | null;
  provider_name?: AuthProvider | null;
  name: string;
  username?: string | null;
  email: string;
  phone?: string | null;
  dob?: string | null;
  gender?: "male" | "female" | null;
  address?: string | null;
  picture?: string | null;
  email_verified_at?: string | null;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  profile?: UserProfile | null;
  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

export interface UsersResponse {
  status: string;
  message: string;
  data: User[];
  meta: {
    pagination: Pagination;
  };
}

export type UserApiResponse = ApiResponse<User[]> | undefined;

export type UserFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<User & { profile?: UserProfile }>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
};
