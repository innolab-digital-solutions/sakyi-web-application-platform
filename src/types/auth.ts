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
