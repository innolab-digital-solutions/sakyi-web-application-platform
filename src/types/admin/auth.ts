import { Permission } from "@/types/admin/permission";
import { ApiResponse } from "@/types/shared/api";

export interface LoginCredentials {
  email: string;
  password: string;
  device_type?: string;
}

export interface User {
  id: number;
  avatar: string;
  username: string;
  provider_name: string | null;
  email: string;
  phone: string | null;
  email_verified_at: string;
  phone_verified_at: string | null;
  status: string;
  last_login_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  permissions?: Permission | Permission[];
}

export interface AuthenticatedResponse {
  user: User;
}

export interface AuthState {
  user: User | undefined;
  loading: boolean;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthenticatedResponse>>;
  logout: () => Promise<void>;
  can: (permission: string) => boolean;
}
