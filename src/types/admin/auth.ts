import { ApiResponse } from "@/types/shared/api";

export interface LoginCredentials {
  email: string;
  password: string;
  device_type?: string;
}

export interface User {
  id: number;
  avatar: string;
  name: string;
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
}

export interface Token {
  access: {
    token: string;
    expires_in_seconds: number;
  };
}

export interface AuthenticatedResponse {
  status: string;
  message: string;
  data: {
    tokens: Token;
    user: User;
  };
}

export interface AuthState {
  user: User | undefined;
  token: string | undefined;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthenticatedResponse>>;
  logout: () => Promise<void>;
  refresh: () => Promise<string | undefined>;
  handleApiError: (error: unknown) => Promise<string | undefined> | undefined;
}
