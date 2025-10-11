import { PATHS } from "@/config/paths";
import { ApiError, ApiResponse, HttpMethod } from "@/types/shared/api";

export interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, unknown> | unknown[];
  parseJson?: boolean;
}

const DEFAULT_BASE_URL = "https://api.sakyi.com/v1";
const DEFAULT_API_DOMAIN = "https://api.sakyi.com";

/**
 * Retrieves CSRF token from cookies
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
 * @param status - The status code of the error
 */
const handleAuthError = (status: number) => {
  if (status === 419 || status === 401) {
    setTimeout(() => {
      globalThis.location.href = PATHS.ADMIN.LOGIN;
    }, 100);
  }
};

/**
 * Core HTTP client for API requests
 *
 * @template T - Expected response data type
 * @param endpoint - API endpoint path
 * @param options - Request configuration options
 * @returns Standardized API response
 */
export const client = async <T>(
  endpoint: string,
  options: FetchOptions & { method?: HttpMethod } = {},
): Promise<ApiResponse<T>> => {
  const { method = "GET", body, headers = {}, parseJson = true, ...requestOptions } = options;

  // Sanctum routes (e.g., /sanctum/csrf-cookie) exclude /v1 prefix
  const isSanctumRoute = endpoint.startsWith("/sanctum/") || endpoint.startsWith("sanctum/");

  let url: string;
  if (isSanctumRoute) {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || DEFAULT_API_DOMAIN;
    url = `${apiDomain.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  } else {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_ENDPOINT || DEFAULT_BASE_URL;
    url = `${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  }

  // Initialize request headers with default Accept header and merge custom headers
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  // Add CSRF token for non-GET requests
  if (method !== "GET") {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      requestHeaders["X-XSRF-TOKEN"] = csrfToken;
    }
  }

  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    // Handle different body types: string, FormData, URLSearchParams, or JSON
    if (typeof body === "string" || body instanceof FormData || body instanceof URLSearchParams) {
      requestBody = body;
    } else {
      // Serialize objects to JSON and set appropriate Content-Type header
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

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    // Return standardized error response for network failures
    return {
      status: "error",
      message: "Network error. Please check your connection.",
      errors: { network: [String(error)] },
      data: undefined,
    };
  }

  // Handle non-JSON responses (e.g., file downloads, plain text)
  if (!parseJson) {
    const text = await response.text();
    return {
      status: response.ok ? "success" : "error",
      message: response.ok ? "Success" : response.statusText,
      data: text as unknown as T,
    };
  }

  // Handle 204 No Content responses (common for DELETE operations)
  if (response.status === 204) {
    return {
      status: "success",
      message: "Success",
      data: undefined as unknown as T,
    };
  }

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

  if (!response.ok || json.status === "error") {
    handleAuthError(response.status);

    return {
      status: "error",
      message: json.message || response.statusText,
      errors: (json as ApiError).errors,
      data: (json as ApiError).data,
    };
  }

  return json;
};

/**
 * HTTP client with method-specific helpers
 *
 * Provides convenient method-specific functions that wrap the core client.
 * Authentication is handled automatically via Laravel Sanctum session cookies.
 * All methods return standardized API responses.
 */
export const http = {
  /**
   * Performs a GET request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param options - Request options (excluding body)
   * @returns Promise resolving to API response
   */
  get: <T>(endpoint: string, options?: Omit<FetchOptions, "body">) => {
    return client<T>(endpoint, { ...options, method: "GET" });
  },

  /**
   * Performs a POST request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param body - Request body data
   * @param options - Additional request options
   * @returns Promise resolving to API response
   */
  post: <T>(endpoint: string, body?: FetchOptions["body"], options?: FetchOptions) => {
    return client<T>(endpoint, { ...options, method: "POST", body });
  },

  /**
   * Performs a PUT request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param body - Request body data
   * @param options - Additional request options
   * @returns Promise resolving to API response
   */
  put: <T>(endpoint: string, body?: FetchOptions["body"], options?: FetchOptions) => {
    return client<T>(endpoint, { ...options, method: "PUT", body });
  },

  /**
   * Performs a PATCH request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param body - Request body data
   * @param options - Additional request options
   * @returns Promise resolving to API response
   */
  patch: <T>(endpoint: string, body?: FetchOptions["body"], options?: FetchOptions) => {
    return client<T>(endpoint, { ...options, method: "PATCH", body });
  },

  /**
   * Performs a DELETE request
   *
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param options - Request options (excluding body)
   * @returns Promise resolving to API response
   */
  delete: <T>(endpoint: string, options?: Omit<FetchOptions, "body">) => {
    return client<T>(endpoint, { ...options, method: "DELETE" });
  },
};
