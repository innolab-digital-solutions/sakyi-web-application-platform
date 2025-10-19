/* eslint-disable no-commented-code/no-commented-code */

import { PATHS } from "@/config/paths";
import { ApiError } from "@/lib/api/error";
import { ApiError as ApiErrorType, ApiResponse, HttpMethod } from "@/types/shared/api";

/**
 * Fetch options for API requests
 *
 * Extends standard RequestInit with custom body handling and error control.
 */
export interface FetchOptions extends Omit<RequestInit, "body"> {
  /** Request body (JSON object, FormData, URLSearchParams, or string) */
  body?: BodyInit | Record<string, unknown> | unknown[];
  /** Whether to parse response as JSON (default: true) */
  parseJson?: boolean;
  /** Whether to throw errors (default: true). Set false for inline error handling */
  throwOnError?: boolean;
}

const DEFAULT_BASE_URL = "https://api.sakyi.com/v1";
const DEFAULT_API_DOMAIN = "https://api.sakyi.com";

/**
 * Extracts XSRF-TOKEN from document cookies
 *
 * Required for Laravel Sanctum CSRF protection on state-changing requests.
 * Returns undefined on server-side or if token not found.
 */
const getCsrfToken = (): string | undefined => {
  if (typeof document === "undefined") return undefined;

  const name = "XSRF-TOKEN=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return cookie.slice(name.length);
    }
  }
  return undefined;
};

/**
 * Handles authentication errors by redirecting to login
 *
 * Triggers on 401 (Unauthorized) or 419 (CSRF token expired).
 */
const handleAuthError = (status: number): void => {
  if (status === 419 || status === 401) {
    setTimeout(() => {
      globalThis.location.href = PATHS.ADMIN.LOGIN;
    }, 100);
  }
};

/**
 * Core HTTP client for Laravel Sanctum API requests
 *
 * Standardizes API communication with automatic CSRF token handling,
 * JSON parsing, error normalization, and authentication redirects.
 *
 * Features:
 * - Automatic CSRF token injection for state-changing requests
 * - Supports both Sanctum auth endpoints and API v1 endpoints
 * - Flexible body handling (JSON, FormData, URLSearchParams)
 * - Network error handling with standardized responses
 * - Optional error throwing for error boundary integration
 *
 * @template T - Expected response data type
 * @param endpoint - API endpoint path (e.g., "roles" or "/sanctum/csrf-cookie")
 * @param options - Request configuration and error handling options
 * @returns Standardized API response with status, message, and data
 * @throws {ApiError} When throwOnError is true and request fails
 *
 * @example
 * ```ts
 * const response = await client<User[]>('users');
 *
 * const response = await client<User>('users', {
 *   method: 'POST',
 *   body: { name: 'John' }
 * });
 *
 * const response = await client<User>('users/1', {
 *   method: 'DELETE',
 *   throwOnError: false
 * });
 * if (response.status === 'error') {
 *   console.error(response.message);
 * }
 * ```
 */
export const client = async <T>(
  endpoint: string,
  options: FetchOptions & { method?: HttpMethod } = {},
): Promise<ApiResponse<T>> => {
  const {
    method = "GET",
    body,
    headers = {},
    parseJson = true,
    throwOnError = true,
    ...requestOptions
  } = options;

  // Determine if endpoint is Sanctum route (no /v1 prefix)
  const isSanctumRoute = endpoint.startsWith("/sanctum/") || endpoint.startsWith("sanctum/");

  // Build full URL
  let url: string;
  if (isSanctumRoute) {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || DEFAULT_API_DOMAIN;
    url = `${apiDomain.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  } else {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_ENDPOINT || DEFAULT_BASE_URL;
    url = `${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  }

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  // Add CSRF token for mutations
  if (method !== "GET") {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      requestHeaders["X-XSRF-TOKEN"] = csrfToken;
    }
  }

  // Prepare request body
  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (typeof body === "string" || body instanceof FormData || body instanceof URLSearchParams) {
      requestBody = body;
    } else {
      requestBody = JSON.stringify(body);
      requestHeaders["Content-Type"] = "application/json";
    }
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials: "include",
    cache: "no-store",
    ...requestOptions,
  };

  // Execute request
  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    // Network error
    return {
      status: "error",
      message: "Network error. Please check your connection.",
      errors: { network: [String(error)] },
      data: undefined,
    };
  }

  // Handle non-JSON responses
  if (!parseJson) {
    const text = await response.text();
    return {
      status: response.ok ? "success" : "error",
      message: response.ok ? "Success" : response.statusText,
      data: text as unknown as T,
    };
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {
      status: "success",
      message: "Success",
      data: undefined as unknown as T,
    };
  }

  // Parse JSON response
  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch {
    return {
      status: "error",
      message: "Invalid JSON response from server",
      data: undefined,
    };
  }

  // Handle errors
  if (!response.ok || json.status === "error") {
    const errorResponse = {
      status: "error" as const,
      message: json.message || response.statusText,
      errors: (json as ApiErrorType).errors,
      data: (json as ApiErrorType).data,
    };

    if (throwOnError) {
      handleAuthError(response.status);
      throw new ApiError(
        errorResponse.message || "An error occurred",
        response.status,
        errorResponse.errors as Record<string, string[]> | undefined,
        response.headers.get("x-request-id") || undefined,
      );
    }
    return errorResponse;
  }

  return json;
};

/**
 * HTTP client with convenient method helpers
 *
 * Provides clean API for making HTTP requests with proper typing.
 * All methods wrap the core client with method-specific defaults.
 */
export const http = {
  /**
   * GET request
   *
   * @template T - Response data type
   * @param endpoint - API endpoint
   * @param options - Request options (no body allowed)
   */
  get: <T>(endpoint: string, options?: Omit<FetchOptions, "body">) => {
    return client<T>(endpoint, {
      ...options,
      method: "GET",
      throwOnError: options?.throwOnError,
    });
  },

  /**
   * POST request
   *
   * @template T - Response data type
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param options - Additional options
   */
  post: <T>(endpoint: string, body?: FetchOptions["body"], options?: FetchOptions) => {
    return client<T>(endpoint, {
      ...options,
      method: "POST",
      body,
      throwOnError: options?.throwOnError,
    });
  },

  /**
   * PUT request
   *
   * @template T - Response data type
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param options - Additional options
   */
  put: <T>(endpoint: string, body?: FetchOptions["body"], options?: FetchOptions) => {
    return client<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
      throwOnError: options?.throwOnError,
    });
  },

  /**
   * PATCH request
   *
   * @template T - Response data type
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param options - Additional options
   */
  patch: <T>(endpoint: string, body?: FetchOptions["body"], options?: FetchOptions) => {
    return client<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
      throwOnError: options?.throwOnError,
    });
  },

  /**
   * DELETE request
   *
   * @template T - Response data type
   * @param endpoint - API endpoint
   * @param options - Request options (no body allowed)
   */
  delete: <T>(endpoint: string, options?: Omit<FetchOptions, "body">) => {
    return client<T>(endpoint, {
      ...options,
      method: "DELETE",
      throwOnError: options?.throwOnError,
    });
  },
};
