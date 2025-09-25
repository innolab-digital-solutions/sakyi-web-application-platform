/* eslint-disable security/detect-object-injection */
"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { useAuth } from "@/context/auth-context";
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
 * Advanced React hook for HTTP request management with authentication, cancellation, and lifecycle callbacks
 *
 * Provides a complete solution for making HTTP requests with proper state management,
 * error handling, and request cancellation capabilities.
 *
 * @returns Object containing request state, methods, and convenience shortcuts
 */
export const useRequest = () => {
  const { token } = useAuth();

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
   * Core request method that handles all HTTP operations
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
    [token, state, resetState],
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
      // Core request state
      loading: state.loading,
      error: state.error,
      cancelled: state.cancelled,

      // Request methods
      visit,
      get,
      post,
      put,
      patch,
      del,
      cancel,
      resetState,

      // Convenience state checks
      isLoading: state.loading,
      hasError: !!state.error,
      isCancelled: state.cancelled,
    }),
    [state, visit, get, post, put, patch, del, cancel, resetState],
  );
};
