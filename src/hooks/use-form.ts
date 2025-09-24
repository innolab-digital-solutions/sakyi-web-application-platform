/* eslint-disable security/detect-object-injection */
"use client";

import { useCallback, useRef, useState } from "react";
import { z, ZodType } from "zod";

import { useAuth } from "@/context/auth-context";
import { http } from "@/lib/api/client";
import { ApiError, ApiResponse } from "@/types/shared/api";

/**
 * Form configuration options
 * @template TSchema - Zod schema type
 */
type FormOptions<TSchema extends ZodType> = {
  validate?: TSchema;
  defaults?: Partial<z.infer<TSchema>>;
  requireAuth?: boolean;
};

/**
 * Submit operation options
 * @template T - Response data type
 */
type SubmitOptions<T> = {
  onSuccess?: (response: ApiResponse<T>) => void;
  onError?: (error: ApiError) => void;
  requireAuth?: boolean;
};

/**
 * Form validation errors mapping
 * @template T - Form data type
 */
type Errors<T> = Partial<Record<keyof T | string, string>>;

/**
 * Advanced React hook for form state management with validation and API integration
 *
 * @template TSchema - Zod schema type for form validation
 * @param initial - Initial form data values
 * @param options - Form configuration options
 *
 * @returns Form state and methods for data manipulation, validation, and submission
 */
export const useForm = <TSchema extends ZodType>(
  initial: z.infer<TSchema>,
  options: FormOptions<TSchema> = {},
) => {
  type T = z.infer<TSchema> & Record<string, unknown>;

  const { token } = useAuth();

  // Core form state
  const [data, setDataState] = useState<T>(initial as T);
  const [defaults, setDefaultsState] = useState<T>(initial as T);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [processing, setProcessing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Request cancellation controller
  const abortController = useRef<AbortController | null>(null);

  /**
   * Updates a specific form field value
   *
   * @param key - Field name to update
   * @param value - New field value
   */
  const setData = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setDataState((previous) => {
        const next = { ...previous, [key]: value } as T;

        // Track dirty state by comparing with defaults
        setIsDirty(JSON.stringify(next) !== JSON.stringify(defaults));
        return next;
      });
    },
    [defaults],
  );

  /**
   * Resets form fields to their default values
   *
   * @param fields - Specific fields to reset (resets all if none provided)
   */
  const reset = useCallback(
    (...fields: (keyof T)[]) => {
      if (fields.length === 0) {
        // Reset all fields
        setDataState(defaults);
        setIsDirty(false);
      } else {
        // Reset only specified fields
        setDataState((previous) => {
          const next = { ...previous } as T;
          for (const f of fields) next[f] = defaults[f];
          return next;
        });
      }
      setErrors({});
    },
    [defaults],
  );

  /**
   * Clears validation errors
   *
   * @param fields - Specific error fields to clear (clears all if none provided)
   */
  const clearErrors = useCallback((...fields: (keyof T | string)[]) => {
    if (fields.length === 0) {
      setErrors({});
    } else {
      setErrors((previous) => {
        const next = { ...previous };

        // Remove specified error fields
        for (const f of fields) delete next[f];
        return next;
      });
    }
  }, []);

  /**
   * Sets validation errors for form fields
   *
   * @param field - Field name or error object to set
   * @param message - Error message (when field is a string)
   */
  const setError = useCallback((field: keyof T | string | Errors<T>, message?: string) => {
    if (typeof field === "string" && message) {
      // Set single field error
      setErrors((previous) => ({ ...previous, [field]: message }));
    } else {
      // Merge multiple errors
      setErrors((previous) => ({ ...previous, ...(field as Errors<T>) }));
    }
  }, []);

  /**
   * Cancels the current form submission request
   */
  const cancel = useCallback(() => {
    abortController.current?.abort();
    setProcessing(false);
  }, []);

  /**
   * Updates the default values for form fields
   *
   * @param field - Field name or partial data object
   * @param value - New default value (when field is a string)
   */
  const setDefaults = useCallback(
    (field?: keyof T | Partial<T>, value?: T[keyof T]) => {
      if (!field) {
        // Set current data as new defaults
        setDefaultsState(data);
      } else if (typeof field === "string") {
        // Set single field default
        setDefaultsState((previous) => ({ ...previous, [field]: value }) as T);
      } else {
        // Merge multiple defaults
        setDefaultsState((previous) => ({ ...previous, ...(field as Partial<T>) }) as T);
      }
    },
    [data],
  );

  /**
   * Runs Zod validation on current form data
   *
   * @returns True if validation passes, false otherwise
   */
  const runValidation = useCallback((): boolean => {
    if (!options.validate) return true;

    const result = options.validate.safeParse(data);
    if (!result.success) {
      // Convert Zod errors to form error format
      const zodErrors: Errors<T> = {};
      for (const error of result.error.issues) {
        const path = error.path.join(".") as keyof T;
        zodErrors[path] = error.message;
      }
      setErrors(zodErrors);
      return false;
    }

    return true;
  }, [data, options.validate]);

  /**
   * Submits form data to the specified endpoint
   *
   * @param method - HTTP method for the request
   * @param url - API endpoint URL
   * @param submitOptions - Additional submission options
   */
  const submit = useCallback(
    async (
      method: "get" | "post" | "put" | "patch" | "delete",
      url: string,
      submitOptions: SubmitOptions<T> = {},
    ) => {
      clearErrors();

      // Validate form data before submission
      if (!runValidation()) return;

      setProcessing(true);
      abortController.current = new AbortController();

      try {
        // Determine authentication requirements
        const needsAuth = submitOptions.requireAuth ?? options.requireAuth ?? true;
        const shouldAuth = needsAuth && token;

        const requestOptions = {
          signal: abortController.current.signal,
          ...(shouldAuth && { token }),
          requireAuth: needsAuth,
        };

        // Execute appropriate HTTP method (GET/DELETE don't send body data)
        const response = await (method === "get" || method === "delete"
          ? http[method]<T>(url, requestOptions)
          : http[method]<T>(url, data, requestOptions));

        if (response.status === "error") {
          // Handle API validation errors
          setErrors((response.errors || {}) as Errors<T>);
          submitOptions.onError?.(response as ApiError);
        } else {
          // Handle successful submission
          submitOptions.onSuccess?.(response);
          setErrors({});
          setIsDirty(false);
        }
      } finally {
        setProcessing(false);
      }
    },
    [data, runValidation, clearErrors, options.requireAuth, token],
  );

  /**
   * Performs a GET request to the specified endpoint
   *
   * @param url - API endpoint URL to send the GET request to
   * @param options_ - Optional submission options for handling success/error callbacks
   * @returns Promise that resolves when the request completes
   */
  const get = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("get", url, options_);
    },
    [submit],
  );

  /**
   * Performs a POST request with form data to the specified endpoint
   *
   * @param url - API endpoint URL to send the POST request to
   * @param options_ - Optional submission options for handling success/error callbacks
   * @returns Promise that resolves when the request completes
   */
  const post = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("post", url, options_);
    },
    [submit],
  );

  /**
   * Performs a PUT request with form data to the specified endpoint
   *
   * @param url - API endpoint URL to send the PUT request to
   * @param options_ - Optional submission options for handling success/error callbacks
   * @returns Promise that resolves when the request completes
   */
  const put = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("put", url, options_);
    },
    [submit],
  );

  /**
   * Performs a PATCH request with form data to the specified endpoint
   *
   * @param url - API endpoint URL to send the PATCH request to
   * @param options_ - Optional submission options for handling success/error callbacks
   * @returns Promise that resolves when the request completes
   */
  const patch = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("patch", url, options_);
    },
    [submit],
  );

  /**
   * Performs a DELETE request to the specified endpoint
   *
   * @param url - API endpoint URL to send the DELETE request to
   * @param options_ - Optional submission options for handling success/error callbacks
   * @returns Promise that resolves when the request completes
   */
  const del = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("delete", url, options_);
    },
    [submit],
  );

  return {
    // Form state
    data,
    errors,
    isDirty,
    processing,

    // Data manipulation methods
    setData,
    reset,
    setDefaults,

    // Error handling methods
    setError,
    clearErrors,

    // Request control
    cancel,
    submit,

    // HTTP method shortcuts
    get,
    post,
    put,
    patch,
    del,
  };
};
