"use client";

import { useState, useCallback, useRef } from "react";
import { http } from "@/lib/fetcher";
import { ApiError, ApiResponse } from "@/types/api";
import { useAuth } from "@/context/auth-context";

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

type RequestConfig = {
  method: "get" | "post" | "put" | "patch" | "delete";
  url: string;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
};

type RequestState = {
  loading: boolean;
  error: ApiError | null;
  cancelled: boolean;
};

export function useRequest() {
  const { token } = useAuth();

  const [state, setState] = useState<RequestState>({
    loading: false,
    error: null,
    cancelled: false,
  });

  const abortController = useRef<AbortController | null>(null);
  const preservedState = useRef<RequestState | null>(null);

  // Reset state
  const resetState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      cancelled: false,
    });
  }, []);

  // Cancel current request
  const cancel = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      setState((prev) => ({ ...prev, cancelled: true, loading: false }));
    }
  }, []);

  // Main visit method (similar to router.visit)
  const visit = useCallback(
    async <T = unknown>(
      url: string,
      options: RequestOptions<T> & {
        method?: "get" | "post" | "put" | "patch" | "delete";
      } = {}
    ): Promise<ApiResponse<T> | null> => {
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

      // Preserve state if needed
      if (preserveState && !preservedState.current) {
        preservedState.current = { ...state };
      }

      const config: RequestConfig = { method, url, data, headers };

      // onBefore callback - can cancel request
      if (onBefore) {
        const shouldContinue = onBefore(config);
        if (shouldContinue === false) {
          return null;
        }
      }

      // Reset state if not preserving
      if (!preserveState) {
        resetState();
      }

      setState((prev) => ({
        ...prev,
        loading: true,
        cancelled: false,
        error: null,
      }));

      // Create new abort controller
      abortController.current = new AbortController();

      // onStart callback
      onStart?.(config);

      try {
        // Determine auth requirements
        const needsAuth = requireAuth && token;

        const requestOptions = {
          signal: abortController.current.signal,
          ...(needsAuth && { token }),
          requireAuth,
          ...headers,
        };

        let response: ApiResponse<T>;

        // Make the actual request based on method
        if (method === "get" || method === "delete") {
          response = await http[method]<T>(url, requestOptions);
        } else {
          response = await http[method]<T>(url, data, requestOptions);
        }

        setState((prev) => ({ ...prev, progress: 100, loading: false }));

        if (response.status === "error") {
          setState((prev) => ({ ...prev, error: response as ApiError }));
          await onError?.(response as ApiError);
        } else {
          setState((prev) => ({ ...prev, error: null }));
          await onSuccess?.(response);
        }

        await onFinish?.(config);
        return response;
      } catch (error: unknown) {
        setState((prev) => ({ ...prev, loading: false }));

        if (error instanceof Error && error.name === "AbortError") {
          setState((prev) => ({ ...prev, cancelled: true }));
          onCancel?.();
        } else {
          const apiError: ApiError = {
            status: "error",
            message: error instanceof Error ? error.message : "Request failed",
            errors:
              (error as { errors?: Record<string, unknown> })?.errors || {},
          };
          setState((prev) => ({ ...prev, error: apiError }));
          await onError?.(apiError);
        }

        await onFinish?.(config);
        return null;
      }
    },
    [token, state, resetState]
  );

  // HTTP method shortcuts (similar to Inertia.js router shortcuts)
  const get = useCallback(
    <T = unknown>(
      url: string,
      data?: Record<string, unknown>,
      options?: Omit<RequestOptions<T>, "data">
    ) => visit<T>(url, { ...options, method: "get", data }),
    [visit]
  );

  const post = useCallback(
    <T = unknown>(
      url: string,
      data?: Record<string, unknown>,
      options?: Omit<RequestOptions<T>, "data">
    ) => visit<T>(url, { ...options, method: "post", data }),
    [visit]
  );

  const put = useCallback(
    <T = unknown>(
      url: string,
      data?: Record<string, unknown>,
      options?: Omit<RequestOptions<T>, "data">
    ) => visit<T>(url, { ...options, method: "put", data }),
    [visit]
  );

  const patch = useCallback(
    <T = unknown>(
      url: string,
      data?: Record<string, unknown>,
      options?: Omit<RequestOptions<T>, "data">
    ) => visit<T>(url, { ...options, method: "patch", data }),
    [visit]
  );

  const del = useCallback(
    <T = unknown>(url: string, options?: RequestOptions<T>) =>
      visit<T>(url, { ...options, method: "delete" }),
    [visit]
  );

  // Reload current request (if you want to implement this)
  const reload = useCallback(() => {
    // This would require storing the last request config
    // For now, it's a placeholder
    console.warn(
      "reload() method needs implementation based on your requirements"
    );
    return Promise.resolve(null);
  }, []);

  return {
    // State
    loading: state.loading,
    error: state.error,
    cancelled: state.cancelled,

    // Methods
    visit,
    get,
    post,
    put,
    patch,
    delete: del,
    reload,
    cancel,
    resetState,

    // Utilities
    isLoading: state.loading,
    hasError: !!state.error,
    isCancelled: state.cancelled,
  };
}

// Export types for external usage
export type { RequestOptions, RequestConfig };
