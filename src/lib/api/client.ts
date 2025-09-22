import { PATHS } from "@/config/paths";
import { ApiError, ApiResponse, HttpMethod } from "@/types/shared/api";

export interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, unknown> | unknown[];
  requireAuth?: boolean;
  token?: string;
  parseJson?: boolean;
}

const DEFAULT_BASE_URL = "https://api.sakyi.com/v1";

/**
 * Global auth error handler
 *
 * @param status - The status code of the error
 */
const handleAuthError = (status: number) => {
  if ((status === 419 || status === 401) && globalThis.window !== undefined) {
    localStorage.removeItem("access-token");
    localStorage.removeItem("token-expires-at");

    localStorage.setItem("logout-signal", Date.now().toString());
    localStorage.removeItem("logout-signal");

    setTimeout(() => {
      globalThis.location.href = PATHS.ADMIN.LOGIN;
    }, 100);
  }
};

/**
 * Core HTTP client for making API requests
 *
 * A clean, consistent API client that works everywhere in the application,
 * including useForm hook, useRequest hook, and direct API calls.
 *
 * @template T - The expected response data type
 * @param endpoint - API endpoint path (without base URL)
 * @param options - Request configuration options
 * @returns Promise resolving to a standardized API response
 */
export const client = async <T>(
  endpoint: string,
  options: FetchOptions & { method?: HttpMethod } = {},
): Promise<ApiResponse<T>> => {
  // Extract configuration options with sensible defaults
  const {
    method = "GET",
    body,
    headers = {},
    requireAuth = true,
    token,
    parseJson = true,
    ...requestOptions
  } = options;

  // Construct the full API URL by combining base URL with endpoint
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_ENDPOINT || DEFAULT_BASE_URL;
  const url = `${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

  // Initialize request headers with default Accept header and merge custom headers
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  // Add Bearer token authentication if required and token is provided
  if (requireAuth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  // Process request body based on its type
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

  // Configure the fetch request with all options
  const config: RequestInit = {
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials: "include", // Include cookies for session management
    cache: "no-store", // Prevent caching for fresh data
    ...requestOptions,
  };

  // Execute the HTTP request with network error handling
  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    // Return standardized error response for network failures
    return {
      status: "error",
      message: "Network error. Please check your connection.",
      errors: { network: [String(error)] },
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

  // Parse JSON response with error handling for malformed JSON
  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch {
    // Return error response for invalid JSON
    return {
      status: "error",
      message: "Invalid JSON response from server",
    };
  }

  // Handle HTTP errors and API-level errors
  if (!response.ok || json.status === "error") {
    // Trigger authentication flow for auth-related errors
    handleAuthError(response.status);

    // Return standardized error response with details
    return {
      status: "error",
      message: json.message || response.statusText,
      errors: (json as ApiError).errors,
      data: (json as ApiError).data,
    };
  }

  // Return successful response
  return json;
};

/**
 * HTTP client with method-specific helpers
 *
 * Provides convenient method-specific functions that wrap the core client.
 * All methods support dynamic authentication via the token option and
 * return standardized API responses.
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
