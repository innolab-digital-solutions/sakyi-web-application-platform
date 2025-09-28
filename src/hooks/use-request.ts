/* eslint-disable security/detect-object-injection */
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useRef, useState } from "react";

import { useAuth } from "@/context/auth-context";
import { useQueryManager } from "@/hooks/use-query-manager";
import { http } from "@/lib/api/client";
import { ApiError, ApiResponse } from "@/types/shared/api";

/**
 * Configuration options for HTTP requests
 *
 * @template T - Expected response data type
 */
type RequestOptions<T = unknown> = {
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
  requireAuth?: boolean;
  preserveState?: boolean;
  onBefore?: (config: RequestConfig) => boolean | void;
  onStart?: (config: RequestConfig) => void;
  onSuccess?: (response: ApiResponse<T>) => void | Promise<void>;
  onError?: (error: ApiError) => void | Promise<void>;
  onFinish?: (config: RequestConfig) => void | Promise<void>;
  onCancel?: () => void;
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
 * Internal request configuration object
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
 * Advanced React hook for HTTP request management with TanStack Query integration
 *
 * Provides a complete solution for making HTTP requests with proper state management,
 * error handling, request cancellation, and TanStack Query integration for both
 * read operations (queries) and write operations (mutations).
 *
 * @param queryConfig - Optional TanStack Query configuration for GET requests
 * @returns Object containing request state, methods, and convenience shortcuts
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
  requireAuth?: boolean;
}) => {
  const { token } = useAuth();
  const queryManager = useQueryManager();

  const [state, setState] = useState<RequestState>({
    loading: false,
    error: undefined,
    cancelled: false,
  });

  // Track active request for cancellation
  const abortController = useRef<AbortController | null>(null);
  // Store previous state when preserveState is enabled
  const preservedState = useRef<RequestState | null>(null);

  /**
   * TanStack Query for GET requests (when queryConfig is provided)
   */
  const requestQuery = useQuery({
    queryKey: queryConfig?.queryKey || [],
    queryFn: async () => {
      if (!queryConfig?.url) {
        throw new Error("Query URL is required");
      }

      const needsAuth = queryConfig.requireAuth ?? true;
      const shouldAuth = needsAuth && token;

      const requestOptions = {
        ...(shouldAuth && { token }),
        requireAuth: needsAuth,
      };

      // For GET requests, data becomes query parameters
      const queryParameters = queryConfig.data;
      const urlWithParameters = queryParameters
        ? `${queryConfig.url}?${new URLSearchParams(queryParameters as Record<string, string>).toString()}`
        : queryConfig.url;

      const response = await http.get<T>(urlWithParameters, requestOptions);

      if (response.status === "error") {
        throw new Error(response.message);
      }

      return response;
    },
    enabled: queryConfig?.enabled ?? true,
    staleTime: queryConfig?.staleTime,
    gcTime: queryConfig?.gcTime,
    refetchOnWindowFocus: queryConfig?.refetchOnWindowFocus,
    refetchOnMount: queryConfig?.refetchOnMount,
    retry: queryConfig?.retry,
  });

  /**
   * Resets request state to initial values
   */
  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: undefined,
      cancelled: false,
    });
  }, []);

  /**
   * Cancels the currently active request
   */
  const cancel = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      setState((previous) => ({ ...previous, cancelled: true, loading: false }));
    }
  }, []);

  /**
   * TanStack Query mutation for write operations (POST, PUT, PATCH, DELETE)
   */
  const requestMutation = useMutation({
    mutationFn: async ({
      method,
      url,
      data,
      headers = {},
      requireAuth = true,
    }: {
      method: "post" | "put" | "patch" | "delete";
      url: string;
      data?: Record<string, unknown>;
      headers?: Record<string, string>;
      requireAuth?: boolean;
    }) => {
      const needsAuth = requireAuth && token;

      const requestOptions = {
        ...(needsAuth && { token }),
        requireAuth,
        ...headers,
      };

      const response = await http[method](url, data, requestOptions);

      if (response.status === "error") {
        throw new Error(response.message);
      }

      return response;
    },
  });

  /**
   * Core request method that handles all HTTP operations with TanStack Query integration
   *
   * @template T - Expected response data type
   * @param url - Target endpoint URL
   * @param options - Request configuration and lifecycle callbacks
   * @returns Promise resolving to API response or undefined if cancelled/failed
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
        requireAuth = true,
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

      // Early cancellation check via onBefore callback
      if (onBefore) {
        const shouldContinue = onBefore(config);
        if (shouldContinue === false) {
          return undefined;
        }
      }

      // If TanStack Query is configured and it's a mutation method, use TanStack Query
      if (
        tanstack &&
        (method === "post" || method === "put" || method === "patch" || method === "delete")
      ) {
        requestMutation.mutate(
          { method, url, data, headers, requireAuth },
          {
            onSuccess: (response) => {
              tanstack.mutationOptions?.onSuccess?.(response as ApiResponse<T>);
              onSuccess?.(response as ApiResponse<T>);

              // Invalidate specified queries
              if (tanstack.invalidateQueries) {
                for (const queryKey of tanstack.invalidateQueries) {
                  if (Array.isArray(queryKey)) {
                    queryManager.invalidateQueries(queryKey);
                  } else {
                    queryManager.invalidateQueries([queryKey]);
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
              tanstack.mutationOptions?.onSettled?.();
              onFinish?.(config);
            },
          },
        );
        return;
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
        // Apply authentication only when both required and available
        const needsAuth = requireAuth && token;

        const requestOptions = {
          signal: abortController.current.signal,
          ...(needsAuth && { token }),
          requireAuth,
          ...headers,
        };

        // Execute request based on HTTP method (GET/DELETE vs POST/PUT/PATCH)
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
    [token, state, resetState, requestMutation, queryManager],
  );

  /**
   * Performs a GET request with query parameters
   *
   * @template T - Expected response data type
   * @param url - Target endpoint URL
   * @param data - Query parameters
   * @param options - Additional request options
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

  /**
   * Performs a POST request with request body data
   *
   * @template T - Expected response data type
   * @param url - Target endpoint URL
   * @param data - Request body data
   * @param options - Additional request options
   */
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

  /**
   * Performs a PUT request with request body data
   *
   * @template T - Expected response data type
   * @param url - Target endpoint URL
   * @param data - Request body data
   * @param options - Additional request options
   */
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

  /**
   * Performs a PATCH request with request body data
   *
   * @template T - Expected response data type
   * @param url - Target endpoint URL
   * @param data - Request body data
   * @param options - Additional request options
   */
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

  /**
   * Performs a DELETE request
   *
   * @template T - Expected response data type
   * @param url - Target endpoint URL
   * @param options - Additional request options
   */
  const del = useCallback(
    <T = unknown>(url: string, options?: RequestOptions<T>) => {
      return visit<T>(url, { ...options, method: "delete" });
    },
    [visit],
  );

  return useMemo(
    () => ({
      // Core request state (manual requests)
      loading: state.loading,
      error: state.error,
      cancelled: state.cancelled,

      // TanStack Query state (when queryConfig is provided)
      ...(queryConfig?.queryKey && {
        data: requestQuery.data,
        isLoading: requestQuery.isLoading,
        isError: requestQuery.isError,
        isSuccess: requestQuery.isSuccess,
        isFetching: requestQuery.isFetching,
        isRefetching: requestQuery.isRefetching,
        error: requestQuery.error,
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

      // Query management
      queryManager,

      // Convenience state checks
      isLoading: queryConfig?.queryKey ? requestQuery.isLoading : state.loading,
      hasError: queryConfig?.queryKey ? !!requestQuery.error : !!state.error,
      isCancelled: state.cancelled,
    }),
    [
      state,
      queryConfig,
      requestQuery,
      visit,
      get,
      post,
      put,
      patch,
      del,
      cancel,
      resetState,
      queryManager,
    ],
  );
};
