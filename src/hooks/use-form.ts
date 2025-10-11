"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import { z, ZodType } from "zod";

import { useQueryManager } from "@/hooks/use-query-manager";
import { http } from "@/lib/api/client";
import { ApiError, ApiResponse } from "@/types/shared/api";

type FormOptions<TSchema extends ZodType> = {
  validate?: TSchema;
  defaults?: Partial<z.infer<TSchema>>;
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

type SubmitOptions<T> = {
  onSuccess?: (response: ApiResponse<T>) => void;
  onError?: (error: ApiError) => void;
};

type Errors<T> = Partial<Record<keyof T | string, string>>;

/**
 * Form state management hook with validation
 */
export const useForm = <TSchema extends ZodType>(
  initial: z.infer<TSchema>,
  options: FormOptions<TSchema> = {},
) => {
  type T = z.infer<TSchema> & Record<string, unknown>;

  const queryManager = useQueryManager();

  // Core form state
  const [data, setDataState] = useState<T>(initial as T);
  const [defaults, setDefaultsState] = useState<T>(initial as T);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [processing, setProcessing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Request cancellation controller
  const abortController = useRef<AbortController | null>(null);

  /**
   * TanStack Query mutation for form submissions
   *
   * Handles form submission with error handling and query invalidation.
   * Authentication is handled automatically via session cookies.
   * Automatically manages request cancellation and state updates on success/error.
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
      // Forms should NEVER show error pages - always handle inline
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

      // Invalidate specified queries
      if (options.tanstack?.invalidateQueries) {
        for (const queryKey of options.tanstack.invalidateQueries) {
          if (Array.isArray(queryKey)) {
            queryManager.invalidateQueries(queryKey);
          } else {
            queryManager.invalidateQueries([queryKey]);
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

  /**
   * Updates form field values
   *
   * @param keyOrData - Field name to update or partial data object
   * @param value - New field value (when keyOrData is a string)
   */
  const setData = useCallback(
    <K extends keyof T>(keyOrData: K | Partial<T>, value?: T[K]) => {
      setDataState((previous) => {
        const next: T =
          typeof keyOrData === "string" && value !== undefined
            ? ({ ...previous, [keyOrData]: value } as T)
            : ({ ...previous, ...(keyOrData as Partial<T>) } as T);

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

      // If TanStack Query is configured and it's a mutation method, use TanStack Query
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

      // Fallback to manual request for GET/DELETE or when TanStack Query is not configured
      setProcessing(true);
      abortController.current = new AbortController();

      try {
        // Request options (session auth handled automatically via cookies)
        const requestOptions = {
          signal: abortController.current.signal,
        };

        // Execute appropriate HTTP method (GET/DELETE don't send body data)
        // Forms should NEVER show error pages - always handle errors inline
        const response = await (method === "get" || method === "delete"
          ? http[method]<T>(url, { ...requestOptions, throwOnError: false })
          : http[method]<T>(url, data, { ...requestOptions, throwOnError: false }));

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
    [data, runValidation, clearErrors, options, formMutation],
  );

  const get = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("get", url, options_);
    },
    [submit],
  );

  const post = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("post", url, options_);
    },
    [submit],
  );

  const put = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("put", url, options_);
    },
    [submit],
  );

  const patch = useCallback(
    (url: string, options_?: SubmitOptions<T>) => {
      return submit("patch", url, options_);
    },
    [submit],
  );

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

    // Error handling methods
    setError,
    clearErrors,

    // Request control
    cancel,
    submit,

    // Query management
    queryManager,

    // HTTP method shortcuts
    get,
    post,
    put,
    patch,
    del,
  };
};
