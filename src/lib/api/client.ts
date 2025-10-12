import { PATHS } from "@/config/paths";
import { ApiError } from "@/lib/api/error";
import { ApiError as ApiErrorType, ApiResponse, HttpMethod } from "@/types/shared/api";

/**
 * Options for customizing API fetch requests.
 * Extends the built-in RequestInit (minus "body"), and provides flexible body and response handling.
 */
export interface FetchOptions extends Omit<RequestInit, "body"> {
  /** Request body (can be primitives, JSON serializable, FormData, etc.) */
  body?: BodyInit | Record<string, unknown> | unknown[];
  /** If false, skips JSON parsing (for file/text responses). Default is true. */
  parseJson?: boolean;
  /**
   * If true (default), errors throw and can bubble to error boundaries.
   * If false, handles errors inline—useful for forms/auth flows.
   */
  throwOnError?: boolean;
}

const DEFAULT_BASE_URL = "https://api.sakyi.com/v1";
const DEFAULT_API_DOMAIN = "https://api.sakyi.com";

/**
 * Get the XSRF-TOKEN value from document cookies.
 * @returns {string | undefined} The XSRF-TOKEN, or undefined if not found or executed server-side.
 */
const getCsrfToken = (): string | undefined => {
  // Guard for server-side execution
  if (typeof document === "undefined") return undefined;
  const name = "XSRF-TOKEN=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(";");

  // Find and extract the XSRF-TOKEN value
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return cookie.slice(name.length);
    }
  }
  return undefined;
};

/**
 * Redirect to login page if an authentication error is encountered.
 * @param status HTTP status code from the response.
 */
const handleAuthError = (status: number) => {
  if (status === 419 || status === 401) {
    setTimeout(() => {
      globalThis.location.href = PATHS.ADMIN.LOGIN;
    }, 100);
  }
};

/**
 * Core HTTP client for API requests.
 * Standardizes API interaction, error handling, CSRF strategy (Laravel Sanctum), and JSON parsing.
 *
 * @template T Expected data shape as returned by the endpoint.
 * @param endpoint API endpoint path (with or without /v1, supports Sanctum endpoints).
 * @param options Fetch customization and handling options.
 * @returns Promise resolving to standardized API response shape.
 * @throws {ApiError} If throwOnError is true and error response is returned.
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

  // Detect if this is a Sanctum endpoint, which should not have the /v1 prefix.
  const isSanctumRoute = endpoint.startsWith("/sanctum/") || endpoint.startsWith("sanctum/");

  // Construct final request URL, ensuring there is only a single slash between segments.
  let url: string;
  if (isSanctumRoute) {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || DEFAULT_API_DOMAIN;
    url = `${apiDomain.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  } else {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_ENDPOINT || DEFAULT_BASE_URL;
    url = `${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  }

  // Set Accept header and merge custom headers (if provided)
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  // Send CSRF token for state-changing methods
  if (method !== "GET") {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      requestHeaders["X-XSRF-TOKEN"] = csrfToken;
    }
  }

  // Set requestBody conditionally based on body shape
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

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    // Network/connection error—return standardized error response
    return {
      status: "error",
      message: "Network error. Please check your connection.",
      errors: { network: [String(error)] },
      data: undefined,
    };
  }

  // If parseJson is false, simply return response as plain text (useful for file downloads, etc)
  if (!parseJson) {
    const text = await response.text();
    return {
      status: response.ok ? "success" : "error",
      message: response.ok ? "Success" : response.statusText,
      data: text as unknown as T,
    };
  }

  // Handle 204 No Content (common on DELETE/PUT/PATCH success, no response body)
  if (response.status === 204) {
    return {
      status: "success",
      message: "Success",
      data: undefined as unknown as T,
    };
  }

  // Attempt to parse JSON response; handle parsing error as a client-side problem
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

  // If the API indicates an error, or HTTP status is not ok, handle gracefully or throw
  if (!response.ok || json.status === "error") {
    const errorResponse = {
      status: "error" as const,
      message: json.message || response.statusText,
      errors: (json as ApiErrorType).errors,
      data: (json as ApiErrorType).data,
    };

    // Only redirect/throw for authentication errors if errors are not handled inline
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

  // Default: return parsed, successful API response
  return json;
};

/**
 * Pre-configured HTTP client with convenience helpers for each HTTP verb (GET, POST, PUT, PATCH, DELETE).
 * Wraps the core client and keeps API usage consistent across the app.
 */
export const http = {
  /**
   * Perform a GET request.
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param options - Custom fetch options (excluding body)
   * @returns Promise resolving to API response of type T
   */
  get: <T>(endpoint: string, options?: Omit<FetchOptions, "body">) => {
    return client<T>(endpoint, {
      ...options,
      method: "GET",
      throwOnError: options?.throwOnError,
    });
  },

  /**
   * Perform a POST request.
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param body - Request body data
   * @param options - Additional request options
   * @returns Promise resolving to API response of type T
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
   * Perform a PUT request.
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param body - Request body data
   * @param options - Additional request options
   * @returns Promise resolving to API response of type T
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
   * Perform a PATCH request.
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param body - Request body data
   * @param options - Additional request options
   * @returns Promise resolving to API response of type T
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
   * Perform a DELETE request.
   * @template T - Expected response data type
   * @param endpoint - API endpoint path
   * @param options - Custom fetch options (excluding body)
   * @returns Promise resolving to API response of type T
   */
  delete: <T>(endpoint: string, options?: Omit<FetchOptions, "body">) => {
    return client<T>(endpoint, {
      ...options,
      method: "DELETE",
      throwOnError: options?.throwOnError,
    });
  },
};
