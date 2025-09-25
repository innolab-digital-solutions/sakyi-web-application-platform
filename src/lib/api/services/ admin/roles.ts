import { ENDPOINTS } from "@/config/endpoints";
import { http } from "@/lib/api/client";
import { RoleApiResponse } from "@/types/admin/role";

/**
 * Role Management Service
 *
 * Provides methods for role management operations including creating, reading,
 * updating, and deleting roles. All methods return standardized
 * API responses with proper error handling.
 */
export const roleService = {
  /**
   * Retrieves a paginated list of roles
   *
   * @param parameters - Optional query parameters for filtering and pagination
   * @returns Promise resolving to API response with roles data and pagination
   * @throws {ApiError} When request fails or user lacks permissions
   */
  index: async (parameters?: Record<string, string>): Promise<RoleApiResponse> => {
    return http.get(ENDPOINTS.ADMIN.ROLES.INDEX, {
      requireAuth: true,
      ...(parameters && { body: parameters }),
    });
  },
};
