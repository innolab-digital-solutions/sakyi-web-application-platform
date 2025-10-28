/* eslint-disable no-commented-code/no-commented-code */
"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { z, ZodType } from "zod";

import { useQueryCache } from "@/hooks/use-query-cache";
import { http } from "@/lib/api/client";
import { ApiError, ApiResponse } from "@/types/shared/api";

/**
 * Form configuration options
 */
type FormOptions<TSchema extends ZodType> = {
  /** Zod schema for form validation */
  validate?: TSchema;
  /** Default values for form fields */
  defaults?: Partial<z.infer<TSchema>>;
  /** TanStack Query integration options */
  tanstack?: {
    queryKey?: string[];
    invalidateQueries?: string[] | string[][];
    mutationOptions?: {
      onSuccess?: (data: ApiResponse<unknown>) => void;
      onError?: (error: ApiError) => void;
      onSettled?: () => void;
    };
  };
};

/**
 * Form submission callback options
 */
type SubmitOptions<T> = {
  onSuccess?: (response: ApiResponse<T>) => void;
  onError?: (error: ApiError) => void;
};

/**
 * Form field errors map
 */
type Errors<T> = Partial<Record<keyof T | string, string>>;

/**
 * Form state management hook with validation and submission
 *
 * Provides comprehensive form functionality including:
 * - Zod schema validation with field-level errors
 * - Dirty state tracking for unsaved changes
 * - TanStack Query integration for mutations
 * - Automatic query invalidation after success
 * - Request cancellation support
 * - Field-level and form-level error handling
 *
 * @template TSchema - Zod schema type for validation
 * @param initial - Initial form data values
 * @param options - Form configuration options
 * @returns Form state, handlers, and HTTP method shortcuts
 *
 * @example
 * Basic usage with validation:
 * const form = useForm({ name: '', email: '' }, {
 *   validate: UserSchema,
 *   tanstack: {
 *     invalidateQueries: ['users'],
 *     mutationOptions: {
 *       onSuccess: () => toast.success('User created!'),
 *       onError: (error) => toast.error(error.message)
 *     }
 *   }
 * });
 */
export const useForm = <TSchema extends ZodType>(
  initial: z.infer<TSchema>,
  options: FormOptions<TSchema> = {},
) => {
  type T = z.infer<TSchema> & Record<string, unknown>;

  const queryCache = useQueryCache();

  // ============================================================================
  // State Management
  // ============================================================================

  /** Current form field values */
  const [data, setDataState] = useState<T>(initial as T);

  /** Default values for reset functionality */
  const [defaults, setDefaultsState] = useState<T>(initial as T);

  /** Field-level validation errors */
  const [errors, setErrors] = useState<Errors<T>>({});

  /** Processing state for manual submissions (non-TanStack) */
  const [processing, setProcessing] = useState(false);

  /** Tracks if form has unsaved changes */
  const [isDirty, setIsDirty] = useState(false);

  /** AbortController for request cancellation */
  const abortController = useRef<AbortController | null>(null);

  // ============================================================================
  // TanStack Query Mutation
  // ============================================================================

  /**
   * TanStack Query mutation for form submissions
   *
   * Handles form submission with automatic error handling, query invalidation,
   * and state management. Authentication is handled via session cookies.
   */
  const formMutation = useMutation({
    mutationFn: async ({
      method,
      url,
      data: formData,
    }: {
      method: string;
      url: string;
      data: T;
    }) => {
      const response = await http[method as keyof typeof http]<T>(url, formData, {
        throwOnError: false,
      });

      if (response.status === "error") {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: (response) => {
      options.tanstack?.mutationOptions?.onSuccess?.(response);

      if (options.tanstack?.invalidateQueries) {
        for (const queryKey of options.tanstack.invalidateQueries) {
          if (Array.isArray(queryKey)) {
            queryCache.invalidateQueries(queryKey);
          } else {
            queryCache.invalidateQueries([queryKey]);
          }
        }
      }

      setErrors({});
      setIsDirty(false);
    },
    onError: (error: Error) => {
      const apiError: ApiError = {
        status: "error",
        message: error.message,
        errors: {},
      };
      setErrors((apiError.errors || {}) as Errors<T>);
      options.tanstack?.mutationOptions?.onError?.(apiError);
    },
    onSettled: () => {
      options.tanstack?.mutationOptions?.onSettled?.();
    },
  });

  // ============================================================================
  // Form Field Management
  // ============================================================================

  /**
   * Update form field values
   *
   * Automatically tracks dirty state by comparing with defaults.
   *
   * @param keyOrData - Single field name or partial data object
   * @param value - New value (required when keyOrData is a field name)
   *
   * @example
   * Single field: form.setData('email', 'user@example.com')
   * Multiple fields: form.setData({ email: 'user@example.com', name: 'John' })
   */
  const setData = useCallback(
    <K extends keyof T>(keyOrData: K | Partial<T>, value?: T[K]) => {
      setDataState((previous) => {
        const next: T =
          typeof keyOrData === "string" && value !== undefined
            ? ({ ...previous, [keyOrData]: value } as T)
            : ({ ...previous, ...(keyOrData as Partial<T>) } as T);

        const isDirty = JSON.stringify(next) !== JSON.stringify(defaults);
        setIsDirty(isDirty);
        return next;
      });
    },
    [defaults],
  );

  /**
   * Reset form fields to default values
   *
   * Clears all errors and updates dirty state.
   *
   * @param fields - Specific fields to reset (resets all if omitted)
   *
   * @example
   * Reset all: form.reset()
   * Reset specific: form.reset('email', 'name')
   */
  const reset = useCallback(
    (...fields: (keyof T)[]) => {
      if (fields.length === 0) {
        setDataState(defaults);
        setIsDirty(false);
      } else {
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
   * Update default values for form fields
   *
   * Useful after successful submission or data loading.
   *
   * @param field - Field name, partial data, or omit to use current data
   * @param value - New default value (when field is a string)
   *
   * @example
   * Use current data: form.setDefaults()
   * Set single field: form.setDefaults('email', 'new@example.com')
   * Set multiple: form.setDefaults({ email: 'new@example.com', name: 'Jane' })
   */
  const setDefaults = useCallback(
    (field?: keyof T | Partial<T>, value?: T[keyof T]) => {
      if (!field) {
        setDefaultsState(data);
      } else if (typeof field === "string") {
        setDefaultsState((previous) => ({ ...previous, [field]: value }) as T);
      } else {
        setDefaultsState((previous) => ({ ...previous, ...(field as Partial<T>) }) as T);
      }
    },
    [data],
  );

  /**
   * Set both data and defaults atomically to prevent dirty state issues
   *
   * This is useful when initializing forms with existing data to ensure
   * the dirty state is calculated correctly.
   *
   * @param newData - The data to set for both current values and defaults
   */
  const setDataAndDefaults = useCallback((newData: Partial<T>) => {
    setDataState(newData as T);
    setDefaultsState(newData as T);
    setIsDirty(false);
  }, []);

  // ============================================================================
  // Error Handling
  // ============================================================================

  /**
   * Set validation errors for form fields
   *
   * @param field - Field name, multiple errors object, or string key
   * @param message - Error message (required when field is a string)
   *
   * @example
   * Single field: form.setError('email', 'Invalid email')
   * Multiple: form.setError({ email: 'Invalid', name: 'Required' })
   */
  const setError = useCallback((field: keyof T | string | Errors<T>, message?: string) => {
    if (typeof field === "string" && message) {
      setErrors((previous) => ({ ...previous, [field]: message }));
    } else {
      setErrors((previous) => ({ ...previous, ...(field as Errors<T>) }));
    }
  }, []);

  /**
   * Clear validation errors
   *
   * @param fields - Specific fields to clear (clears all if omitted)
   *
   * @example
   * Clear all: form.clearErrors()
   * Clear specific: form.clearErrors('email', 'name')
   */
  const clearErrors = useCallback((...fields: (keyof T | string)[]) => {
    if (fields.length === 0) {
      setErrors({});
    } else {
      setErrors((previous) => {
        const next = { ...previous };
        for (const f of fields) delete next[f];
        return next;
      });
    }
  }, []);

  // ============================================================================
  // Validation
  // ============================================================================

  /**
   * Run Zod schema validation on current form data
   *
   * Converts Zod validation errors to field-level error format.
   *
   * @returns True if validation passes, false otherwise
   */
  const runValidation = useCallback((): boolean => {
    if (!options.validate) return true;

    const result = options.validate.safeParse(data);
    if (!result.success) {
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

  // ============================================================================
  // Request Management
  // ============================================================================

  /**
   * Cancel the current form submission
   *
   * Aborts the HTTP request and updates processing state.
   */
  const cancel = useCallback(() => {
    abortController.current?.abort();
    setProcessing(false);
  }, []);

  // ============================================================================
  // Form Submission
  // ============================================================================

  /**
   * Submit form data to API endpoint
   *
   * Handles validation, submission, and error processing. Uses TanStack Query
   * mutation when configured, otherwise falls back to manual HTTP request.
   *
   * @param method - HTTP method to use
   * @param url - API endpoint URL
   * @param submitOptions - Success/error callbacks
   *
   * @example
   * form.submit('post', '/api/users', {
   *   onSuccess: (res) => toast.success(res.message),
   *   onError: (err) => toast.error(err.message)
   * });
   */
  const submit = useCallback(
    async (
      method: "get" | "post" | "put" | "patch" | "delete",
      url: string,
      submitOptions: SubmitOptions<T> = {},
    ) => {
      clearErrors();

      if (!runValidation()) return;

      /** Use TanStack Query mutation for write operations when configured */
      if (
        options.tanstack &&
        (method === "post" || method === "put" || method === "patch" || method === "delete")
      ) {
        formMutation.mutate(
          { method, url, data },
          {
            onSuccess: (response) => {
              submitOptions.onSuccess?.(response);
            },
            onError: (error) => {
              submitOptions.onError?.(error as unknown as ApiError);
            },
          },
        );
        return;
      }

      /** Fallback to manual HTTP request */
      setProcessing(true);
      abortController.current = new AbortController();

      try {
        const requestOptions = {
          signal: abortController.current.signal,
        };

        const response = await (method === "get" || method === "delete"
          ? http[method]<T>(url, { ...requestOptions, throwOnError: false })
          : http[method]<T>(url, data, { ...requestOptions, throwOnError: false }));

        if (response.status === "error") {
          setErrors((response.errors || {}) as Errors<T>);
          submitOptions.onError?.(response as ApiError);
        } else {
          submitOptions.onSuccess?.(response);
          setErrors({});
          setIsDirty(false);
        }
      } finally {
        setProcessing(false);
      }
    },
    [data, runValidation, clearErrors, options, formMutation],
  );

  // ============================================================================
  // HTTP Method Shortcuts
  // ============================================================================

  /**
   * Submit form using GET method
   *
   * @param url - API endpoint URL
   * @param options - Success/error callbacks
   */
  const get = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("get", url, options_);
    },
    [submit],
  );

  /**
   * Submit form using POST method
   *
   * @param url - API endpoint URL
   * @param options - Success/error callbacks
   */
  const post = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("post", url, options_);
    },
    [submit],
  );

  /**
   * Submit form using PUT method
   *
   * @param url - API endpoint URL
   * @param options - Success/error callbacks
   */
  const put = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("put", url, options_);
    },
    [submit],
  );

  /**
   * Submit form using PATCH method
   *
   * @param url - API endpoint URL
   * @param options - Success/error callbacks
   */
  const patch = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("patch", url, options_);
    },
    [submit],
  );

  /**
   * Submit form using DELETE method
   *
   * @param url - API endpoint URL
   * @param options - Success/error callbacks
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
    processing: options.tanstack ? formMutation.isPending : processing,

    // Data manipulation methods
    setData,
    reset,
    setDefaults,
    setDataAndDefaults,

    // Error handling methods
    setError,
    clearErrors,

    // Request control
    cancel,
    submit,

    // Query cache management
    queryCache,

    // HTTP method shortcuts
    get,
    post,
    put,
    patch,
    del,
  };
};
