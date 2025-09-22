import { ENDPOINTS } from "@/config/endpoints";
import { http } from "@/lib/api/client";
import { AuthenticatedResponse, LoginCredentials, User } from "@/types/admin/auth";
import { ApiResponse } from "@/types/shared/api";

/**
 * Authentication Service
 *
 * Provides methods for user authentication operations including login, logout,
 * token refresh, and user profile retrieval. All methods return standardized
 * API responses with proper error handling.
 */
export const authService = {
  /**
   * Authenticates a user with email and password
   *
   * @param credentials - User login credentials (email and password)
   * @returns Promise resolving to API response with authentication data (user + token)
   * @throws {ApiError} When login fails due to invalid credentials or server error
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthenticatedResponse>> => {
    return http.post<AuthenticatedResponse>(
      ENDPOINTS.AUTH.LOGIN,
      { ...credentials },
      {
        requireAuth: false,
      },
    );
  },

  /**
   * Logs out the current user and invalidates their session
   *
   * @param token - Optional authentication token to logout specific session
   * @returns Promise resolving to API response (void on success)
   * @throws {ApiError} When logout fails or token is invalid
   */
  logout: async (token?: string): Promise<ApiResponse<void>> => {
    return http.post<void>(
      ENDPOINTS.AUTH.LOGOUT,
      {},
      {
        requireAuth: true,
        ...(token && { token }),
      },
    );
  },

  /**
   * Refreshes the authentication token to extend session
   *
   * @returns Promise resolving to API response with new authentication data
   * @throws {ApiError} When refresh fails due to expired token or server error
   */
  refresh: async (): Promise<ApiResponse<AuthenticatedResponse>> => {
    return http.post<AuthenticatedResponse>(ENDPOINTS.AUTH.REFRESH, {}, { requireAuth: false });
  },

  /**
   * Retrieves the current authenticated user's profile information
   *
   * @param token - Authentication token for the user
   * @returns Promise resolving to API response with user profile data
   * @throws {ApiError} When token is invalid or user not found
   */
  me: async (token: string): Promise<ApiResponse<User>> => {
    return http.get<User>(ENDPOINTS.AUTH.ME, { requireAuth: true, token });
  },
};
