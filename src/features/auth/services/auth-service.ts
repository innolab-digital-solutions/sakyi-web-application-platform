import { AUTH } from "@/config/endpoints";
import { http } from "@/lib/fetcher";
import { ApiResponse } from "@/types/api";
import { AuthenticatedResponse } from "@/types/auth";

import { LoginFormData } from "../validations/login-schema";

export const authService = {
  login: async (data: LoginFormData): Promise<ApiResponse<AuthenticatedResponse["data"]>> =>
    http.post(AUTH.LOGIN, data),

  logout: async () => http.post(AUTH.LOGOUT),

  refresh: async () => http.post(AUTH.REFRESH),
};
