import { ADMIN } from "@/config/routes";
import { ApiError, ApiResponse, FetchOptions, HttpMethod } from "@/types/api";

const DEFAULT_BASE_URL = "https://api.sakyi.com/v1";

// Global auth error handler
const handleAuthError = (status: number) => {
  // 419 = Token expired/invalid, 401 = Unauthorized
  if (
    (status === 419 || status === 401) && // Only handle on client-side
    globalThis.window !== undefined
  ) {
    console.warn(`🔒 Authentication error (${status}): Redirecting to login`);

    // Clear any stored auth data
    localStorage.removeItem("access-token");
    localStorage.removeItem("token-expires-at");

    // Signal cross-tab logout for consistency
    localStorage.setItem("logout-signal", Date.now().toString());
    localStorage.removeItem("logout-signal");

    // Redirect to login page
    const redirectToLogin = () => {
      globalThis.location.href = ADMIN.LOGIN;
    };

    // Small delay to allow any pending state updates to complete
    setTimeout(redirectToLogin, 100);
  }
};

/**
 * Core HTTP client for making API requests
 * Clean, consistent API that works everywhere eg. in useForm hook or in any other place
 */
export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions & { method?: HttpMethod } = {},
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    headers = {},
    requireAuth = true,
    token,
    parseJson = true,
    ...requestOptions
  } = options;

  // Build URL
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_ENDPOINT || DEFAULT_BASE_URL;
  const url = `${baseUrl.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;

  // Build headers
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  // Handle authentication
  if (requireAuth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  // Handle body and content-type
  let requestBody: BodyInit | undefined;
  if (body !== undefined) {
    if (typeof body === "string" || body instanceof FormData || body instanceof URLSearchParams) {
      requestBody = body;
    } else {
      requestBody = JSON.stringify(body);
      requestHeaders["Content-Type"] = "application/json";
    }
  }

  // Build request config
  const config: RequestInit = {
    method,
    headers: requestHeaders,
    body: requestBody,
    credentials: "include",
    cache: "no-store",
    ...requestOptions,
  };

  // Make request
  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (error) {
    return {
      status: "error",
      message: "Network error. Please check your connection.",
      errors: { network: [String(error)] },
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

  // Parse JSON response
  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch {
    return {
      status: "error",
      message: "Invalid JSON response from server",
    };
  }

  // Handle error responses
  if (!response.ok || json.status === "error") {
    // Handle authentication errors globally
    handleAuthError(response.status);

    return {
      status: "error",
      message: json.message || response.statusText,
      errors: (json as ApiError).errors,
      data: (json as ApiError).data,
    };
  }

  return json;
}

/**
 * HTTP client with method-specific helpers
 * Supports dynamic authentication via token option
 */
export const http = {
  /**
   * GET request
   */
  get: <T>(endpoint: string, options?: Omit<FetchOptions, "body">) =>
    fetcher<T>(endpoint, { ...options, method: "GET" }),

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: FetchOptions["body"], options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: "POST", body }),

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: FetchOptions["body"], options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: "PUT", body }),

  /**
   * PATCH request
   */
  patch: <T>(endpoint: string, body?: FetchOptions["body"], options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: "PATCH", body }),

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string, options?: Omit<FetchOptions, "body">) =>
    fetcher<T>(endpoint, { ...options, method: "DELETE" }),
};
