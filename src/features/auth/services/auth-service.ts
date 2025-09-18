import { http } from "@/lib/fetcher";
import { AUTH } from "@/config/endpoints";
import { LoginFormData } from "../validations/login-schema";
import { AuthenticatedResponse } from "@/types/auth";
import { ApiResponse } from "@/types/api";

export const authService = {
  login: async (
    data: LoginFormData
  ): Promise<ApiResponse<AuthenticatedResponse["data"]>> =>
    http.post(AUTH.LOGIN, data),

  logout: async () => http.post(AUTH.LOGOUT),

  refresh: async () => http.post(AUTH.REFRESH),
};
