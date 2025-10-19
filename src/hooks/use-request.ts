"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";

import { useQueryCache } from "@/hooks/use-query-cache";
import { http } from "@/lib/api/client";
import { ApiError, ApiResponse } from "@/types/shared/api";

/**
 * Request lifecycle options
 */
type RequestOptions<T = unknown> = {
  /** Request payload data */
  data?: Record<string, unknown>;
  /** Custom HTTP headers */
  headers?: Record<string, string>;
  /** Preserve state on new requests */
  preserveState?: boolean;
  /** Called before request starts (return false to cancel) */
  onBefore?: (config: RequestConfig) => boolean | void;
  /** Called when request starts */
  onStart?: (config: RequestConfig) => void;
  /** Called on successful response */
  onSuccess?: (response: ApiResponse<T>) => void | Promise<void>;
  /** Called on error response */
  onError?: (error: ApiError) => void | Promise<void>;
  /** Called when request completes (success or error) */
  onFinish?: (config: RequestConfig) => void | Promise<void>;
  /** Called when request is cancelled */
  onCancel?: () => void;
  /** TanStack Query integration options */
  tanstack?: {
    queryKey?: string[];
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
    retry?: boolean | number;
    invalidateQueries?: string[] | string[][];
    mutationOptions?: {
      onSuccess?: (data: ApiResponse<T>) => void;
      onError?: (error: ApiError) => void;
      onSettled?: () => void;
    };
  };
};

/**
 * HTTP request configuration
 */
type RequestConfig = {
  method: "get" | "post" | "put" | "patch" | "delete";
  url: string;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
};

/**
 * Request state tracking
 */
type RequestState = {
  loading: boolean;
  error: ApiError | null | undefined;
  cancelled: boolean;
};

/**
 * HTTP request hook with TanStack Query integration
 *
 * Provides unified interface for HTTP requests with:
 * - TanStack Query integration for caching and state management
 * - GET requests via useQuery (for queryConfig provided)
 * - Mutations via useMutation (POST/PUT/PATCH/DELETE)
 * - Manual requests with lifecycle hooks
 * - Automatic query invalidation
 * - Request cancellation support
 *
 * @template T - Expected response data type
 * @param queryConfig - Query configuration for GET requests
 * @returns Request state, HTTP method functions, and query management
 */
export const useRequest = <T = unknown>(queryConfig?: {
  queryKey?: string[];
  url?: string;
  data?: Record<string, unknown>;
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  retry?: boolean | number;
}) => {
  const queryCache = useQueryCache();

  // ============================================================================
  // State Management
  // ============================================================================

  /** Manual request state tracking */
  const [state, setState] = useState<RequestState>({
    loading: false,
    error: undefined,
    cancelled: false,
  });

  /** AbortController for request cancellation */
  const abortController = useRef<AbortController | null>(null);

  /** Preserved state when preserveState option is enabled */
  const preservedState = useRef<RequestState | null>(null);

  /** Tracks active mutation key to prevent duplicates */
  const activeMutation = useRef<string | undefined>(undefined);

  // ============================================================================
  // TanStack Query Integration
  // ============================================================================

  /**
   * TanStack Query for GET requests
   *
   * Always creates a query but only enables it when queryConfig is provided.
   * For mutations without config, the query remains disabled.
   */
  const requestQuery = useQuery({
    queryKey: queryConfig?.queryKey || ["useRequest-disabled"],
    queryFn: async () => {
      if (!queryConfig?.url) {
        throw new Error("Query URL is required");
      }

      const queryParameters = queryConfig.data;
      const urlWithParameters = queryParameters
        ? `${queryConfig.url}?${new URLSearchParams(queryParameters as Record<string, string>).toString()}`
        : queryConfig.url;

      const response = await http.get<T>(urlWithParameters);

      if (response.status === "error") {
        throw new Error(response.message);
      }

      return response;
    },
    enabled: !!queryConfig && (queryConfig.enabled ?? true),
    staleTime: queryConfig?.staleTime,
    gcTime: queryConfig?.gcTime,
    refetchOnWindowFocus: queryConfig?.refetchOnWindowFocus,
    refetchOnMount: queryConfig?.refetchOnMount,
    retry: queryConfig?.retry,
  });

  // ============================================================================
  // Utility Functions
  // ============================================================================

  /**
   * Reset request state to initial values
   */
  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: undefined,
      cancelled: false,
    });
  }, []);

  /**
   * Cancel the currently active request
   *
   * Aborts the HTTP request and updates state.
   */
  const cancel = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      setState((previous) => ({ ...previous, cancelled: true, loading: false }));
    }
  }, []);

  /**
   * TanStack Query mutation for write operations
   *
   * Handles POST, PUT, PATCH, and DELETE requests with automatic
   * error handling and query invalidation.
   */
  const requestMutation = useMutation({
    mutationKey: ["request-mutation"],
    retry: false,
    mutationFn: async ({
      method,
      url,
      data,
      headers = {},
    }: {
      method: "post" | "put" | "patch" | "delete";
      url: string;
      data?: Record<string, unknown>;
      headers?: Record<string, string>;
    }) => {
      const requestOptions = {
        ...headers,
      };

      const response =
        method === "delete"
          ? await http.delete(url, requestOptions)
          : await http[method](url, data, requestOptions);

      if (response.status === "error") {
        throw new Error(response.message);
      }

      return response;
    },
  });

  // ============================================================================
  // Core Request Function
  // ============================================================================

  /**
   * Core request method with lifecycle hooks and TanStack Query integration
   *
   * Handles all HTTP methods with:
   * - Lifecycle callbacks (onBefore, onStart, onSuccess, onError, onFinish)
   * - TanStack Query mutations for write operations
   * - Manual HTTP requests as fallback
   * - Automatic query invalidation
   * - Request cancellation support
   *
   * @template T - Expected response data type
   * @param url - API endpoint URL
   * @param options - Request configuration and callbacks
   * @returns Promise resolving to API response or undefined
   */
  const visit = useCallback(
    async <T = unknown>(
      url: string,
      options: RequestOptions<T> & {
        method?: "get" | "post" | "put" | "patch" | "delete";
      } = {},
    ): Promise<ApiResponse<T> | undefined> => {
      const {
        method = "get",
        data = {},
        headers = {},
        preserveState = false,
        onBefore,
        onStart,
        onSuccess,
        onError,
        onFinish,
        onCancel,
        tanstack,
      } = options;

      // Store current state before potential reset
      if (preserveState && !preservedState.current) {
        preservedState.current = { ...state };
      }

      const config: RequestConfig = { method, url, data, headers };

      if (onBefore) {
        const shouldContinue = onBefore(config);
        if (shouldContinue === false) {
          return undefined;
        }
      }

      /** Route to TanStack Query mutation for write operations */
      if (
        tanstack &&
        (method === "post" || method === "put" || method === "patch" || method === "delete")
      ) {
        const mutationKey = `${method}-${url}`;

        if (activeMutation.current === mutationKey) {
          return undefined;
        }
        activeMutation.current = mutationKey;

        requestMutation.mutate(
          { method, url, data, headers },
          {
            onSuccess: (response) => {
              tanstack.mutationOptions?.onSuccess?.(response as ApiResponse<T>);
              onSuccess?.(response as ApiResponse<T>);

              // Invalidate specified queries
              if (tanstack.invalidateQueries) {
                for (const queryKey of tanstack.invalidateQueries) {
                  if (Array.isArray(queryKey)) {
                    queryCache.invalidateQueries(queryKey);
                  } else {
                    queryCache.invalidateQueries([queryKey]);
                  }
                }
              }
            },
            onError: (error) => {
              const apiError: ApiError = {
                status: "error",
                message: error.message,
                errors: {},
              };
              tanstack.mutationOptions?.onError?.(apiError);
              onError?.(apiError);
            },
            onSettled: () => {
              activeMutation.current = undefined; // Clear active mutation
              tanstack.mutationOptions?.onSettled?.();
              onFinish?.(config);
            },
          },
        );
        return undefined; // Explicitly return undefined to prevent fallback execution
      }

      // Fallback to manual request for GET/DELETE or when TanStack Query is not configured
      // Clear state unless explicitly preserving
      if (!preserveState) {
        resetState();
      }

      setState((previous) => ({
        ...previous,
        loading: true,
        cancelled: false,
        error: undefined,
      }));

      // Setup request cancellation mechanism
      abortController.current = new AbortController();

      onStart?.(config);

      try {
        // Request options (session auth handled automatically via cookies)
        const requestOptions = {
          signal: abortController.current.signal,
          ...headers,
        };

        // Execute request based on HTTP method (GET/DELETE vs POST/PUT/PATCH)
        // Errors throw by default - error.tsx will catch them
        const response: ApiResponse<T> = await (method === "get" || method === "delete"
          ? http[method]<T>(url, requestOptions)
          : http[method]<T>(url, data, requestOptions));

        setState((previous) => ({ ...previous, progress: 100, loading: false }));

        // Handle API-level errors vs successful responses
        if (response.status === "error") {
          setState((previous) => ({ ...previous, error: response as ApiError }));
          await onError?.(response as ApiError);
        } else {
          setState((previous) => ({ ...previous, error: undefined }));
          await onSuccess?.(response);
        }

        await onFinish?.(config);
        return response;
      } catch (error: unknown) {
        setState((previous) => ({ ...previous, loading: false }));

        // Distinguish between cancellation and actual errors
        if (error instanceof Error && error.name === "AbortError") {
          setState((previous) => ({ ...previous, cancelled: true }));
          onCancel?.();
        } else {
          // Convert any error to standardized API error format
          const apiError: ApiError = {
            status: "error",
            message: error instanceof Error ? error.message : "Request failed",
            errors: (error as { errors?: Record<string, unknown> })?.errors || {},
          };
          setState((previous) => ({ ...previous, error: apiError }));
          await onError?.(apiError);
        }

        await onFinish?.(config);
        return undefined;
      }
    },
    [state, resetState, requestMutation, queryCache],
  );

  // ============================================================================
  // HTTP Method Shortcuts
  // ============================================================================

  /**
   * Perform GET request with query parameters
   *
   * @template T - Expected response data type
   * @param url - API endpoint URL
   * @param data - Query parameters
   * @param options - Request lifecycle callbacks
   */
  const get = useCallback(
    <T = unknown>(
      url: string,
      data?: Record<string, unknown>,
      options?: Omit<RequestOptions<T>, "data">,
    ) => {
      return visit<T>(url, { ...options, method: "get", data });
    },
    [visit],
  );

  /** Perform POST request with request body */
  const post = useCallback(
    <T = unknown>(
      url: string,
      data?: Record<string, unknown>,
      options?: Omit<RequestOptions<T>, "data">,
    ) => {
      return visit<T>(url, { ...options, method: "post", data });
    },
    [visit],
  );

  /** Perform PUT request with request body */
  const put = useCallback(
    <T = unknown>(
      url: string,
      data?: Record<string, unknown>,
      options?: Omit<RequestOptions<T>, "data">,
    ) => {
      return visit<T>(url, { ...options, method: "put", data });
    },
    [visit],
  );

  /** Perform PATCH request with request body */
  const patch = useCallback(
    <T = unknown>(
      url: string,
      data?: Record<string, unknown>,
      options?: Omit<RequestOptions<T>, "data">,
    ) => {
      return visit<T>(url, { ...options, method: "patch", data });
    },
    [visit],
  );

  /** Perform DELETE request */
  const del = useCallback(
    <T = unknown>(url: string, options?: RequestOptions<T>) => {
      return visit<T>(url, { ...options, method: "delete" });
    },
    [visit],
  );

  return useMemo(
    () => ({
      // Unified loading state - works for manual requests, queries, and mutations
      loading:
        state.loading ||
        requestMutation.isPending ||
        (queryConfig?.queryKey ? requestQuery.isLoading : false),

      // Unified error state
      error:
        state.error ||
        requestMutation.error ||
        (queryConfig?.queryKey ? requestQuery.error : undefined),

      // Unified success state
      isSuccess:
        requestMutation.isSuccess || (queryConfig?.queryKey ? requestQuery.isSuccess : false),

      // Core request state (manual requests)
      cancelled: state.cancelled,

      // TanStack Query state (when queryConfig is provided)
      ...(queryConfig?.queryKey && {
        data: requestQuery.data,
        isFetching: requestQuery.isFetching,
        isRefetching: requestQuery.isRefetching,
        refetch: requestQuery.refetch,
      }),

      // Request methods
      visit,
      get,
      post,
      put,
      patch,
      del,
      cancel,
      resetState,

      // Query cache management
      queryCache,

      // Convenience state checks
      hasError:
        !!state.error ||
        !!requestMutation.error ||
        (queryConfig?.queryKey ? !!requestQuery.error : false),
      isCancelled: state.cancelled,
    }),
    [
      state.loading,
      state.error,
      state.cancelled,
      requestMutation.isPending,
      requestMutation.error,
      requestMutation.isSuccess,
      queryConfig?.queryKey,
      requestQuery.isLoading,
      requestQuery.error,
      requestQuery.isSuccess,
      requestQuery.data,
      requestQuery.isFetching,
      requestQuery.isRefetching,
      requestQuery.refetch,
      visit,
      get,
      post,
      put,
      patch,
      del,
      cancel,
      resetState,
      queryCache,
    ],
  );
};
