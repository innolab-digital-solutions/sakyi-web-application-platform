"use client";

import { useState, useCallback, useRef } from "react";
import { z, ZodType } from "zod";
import { http } from "@/lib/fetcher";
import { ApiError, ApiResponse } from "@/types/api";
import { useAuth } from "@/context/auth-context";

type FormOptions<TSchema extends ZodType> = {
  validate?: TSchema;
  defaults?: Partial<z.infer<TSchema>>;
  requireAuth?: boolean;
};

type SubmitOptions<T> = {
  onSuccess?: (response: ApiResponse<T>) => void;
  onError?: (error: ApiError) => void;
  requireAuth?: boolean;
};

type Errors<T> = Partial<Record<keyof T | string, string>>;

export function useForm<TSchema extends ZodType>(
  initial: z.infer<TSchema>,
  options: FormOptions<TSchema> = {}
) {
  type T = z.infer<TSchema> & Record<string, unknown>;

  const { token } = useAuth();

  const [data, setDataState] = useState<T>(initial as T);
  const [defaults, setDefaultsState] = useState<T>(initial as T);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [processing, setProcessing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const abortController = useRef<AbortController | null>(null);

  // ---------------------------
  // Helpers
  // ---------------------------
  const setData = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setDataState((prev) => {
        const next = { ...prev, [key]: value } as T;
        setIsDirty(JSON.stringify(next) !== JSON.stringify(defaults));
        return next;
      });
    },
    [defaults]
  );

  const reset = useCallback(
    (...fields: (keyof T)[]) => {
      if (fields.length === 0) {
        setDataState(defaults);
        setIsDirty(false);
      } else {
        setDataState((prev) => {
          const next = { ...prev } as T;
          fields.forEach((f) => (next[f] = defaults[f]));
          return next;
        });
      }
      setErrors({});
    },
    [defaults]
  );

  const clearErrors = useCallback((...fields: (keyof T | string)[]) => {
    if (fields.length === 0) {
      setErrors({});
    } else {
      setErrors((prev) => {
        const next = { ...prev };
        fields.forEach((f) => delete next[f]);
        return next;
      });
    }
  }, []);

  const setError = useCallback(
    (field: keyof T | string | Errors<T>, message?: string) => {
      if (typeof field === "string" && message) {
        setErrors((prev) => ({ ...prev, [field]: message }));
      } else {
        setErrors((prev) => ({ ...prev, ...(field as Errors<T>) }));
      }
    },
    []
  );

  const cancel = useCallback(() => {
    abortController.current?.abort();
    setProcessing(false);
  }, []);

  const setDefaults = useCallback(
    (field?: keyof T | Partial<T>, value?: T[keyof T]) => {
      if (!field) {
        setDefaultsState(data);
      } else if (typeof field === "string") {
        setDefaultsState((prev) => ({ ...prev, [field]: value } as T));
      } else {
        setDefaultsState(
          (prev) => ({ ...prev, ...(field as Partial<T>) } as T)
        );
      }
    },
    [data]
  );

  // ---------------------------
  // Validation + Submit
  // ---------------------------
  const runValidation = useCallback((): boolean => {
    if (!options.validate) return true;

    const result = options.validate.safeParse(data);
    if (!result.success) {
      const zodErrors: Errors<T> = {};
      result.error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join(".") as keyof T;
        zodErrors[path] = err.message;
      });
      setErrors(zodErrors);
      return false;
    }

    return true;
  }, [data, options.validate]);

  const submit = useCallback(
    async (
      method: "get" | "post" | "put" | "patch" | "delete",
      url: string,
      submitOptions: SubmitOptions<T> = {}
    ) => {
      clearErrors();

      if (!runValidation()) return;

      setProcessing(true);
      abortController.current = new AbortController();

      try {
        let response: ApiResponse<T>;

        const needsAuth =
          submitOptions.requireAuth ?? options.requireAuth ?? true;
        const shouldAuth = needsAuth && token;

        const requestOptions = {
          signal: abortController.current.signal,
          ...(shouldAuth && { token }),
          requireAuth: needsAuth,
        };

        if (method === "get" || method === "delete") {
          response = await http[method]<T>(url, requestOptions);
        } else {
          response = await http[method]<T>(url, data, requestOptions);
        }

        if (response.status === "error") {
          setErrors((response.errors || {}) as Errors<T>);
          submitOptions.onError?.(response);
        } else {
          submitOptions.onSuccess?.(response);
          setErrors({});
          setIsDirty(false);
        }
      } finally {
        setProcessing(false);
      }
    },
    [data, runValidation, clearErrors, options.requireAuth, token]
  );

  return {
    data,
    setData,
    errors,
    setError,
    clearErrors,
    reset,
    setDefaults,
    isDirty,
    processing,
    cancel,

    submit,
    get: (url: string, opts?: SubmitOptions<T>) => submit("get", url, opts),
    post: (url: string, opts?: SubmitOptions<T>) => submit("post", url, opts),
    put: (url: string, opts?: SubmitOptions<T>) => submit("put", url, opts),
    patch: (url: string, opts?: SubmitOptions<T>) => submit("patch", url, opts),
    delete: (url: string, opts?: SubmitOptions<T>) =>
      submit("delete", url, opts),
  };
}
