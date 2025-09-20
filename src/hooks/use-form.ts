"use client";

import { useCallback, useRef, useState } from "react";
import { z, ZodType } from "zod";

import { useAuth } from "@/context/auth-context";
import { http } from "@/lib/fetcher";
import { ApiError, ApiResponse } from "@/types/api";

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
  options: FormOptions<TSchema> = {},
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
      setDataState((previous) => {
        const next = { ...previous, [key]: value } as T;
        setIsDirty(JSON.stringify(next) !== JSON.stringify(defaults));
        return next;
      });
    },
    [defaults],
  );

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

  const setError = useCallback((field: keyof T | string | Errors<T>, message?: string) => {
    if (typeof field === "string" && message) {
      setErrors((previous) => ({ ...previous, [field]: message }));
    } else {
      setErrors((previous) => ({ ...previous, ...(field as Errors<T>) }));
    }
  }, []);

  const cancel = useCallback(() => {
    abortController.current?.abort();
    setProcessing(false);
  }, []);

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

  // ---------------------------
  // Validation + Submit
  // ---------------------------
  const runValidation = useCallback((): boolean => {
    if (!options.validate) return true;

    const result = options.validate.safeParse(data);
    if (!result.success) {
      const zodErrors: Errors<T> = {};
      result.error.issues.forEach((error: z.ZodIssue) => {
        const path = error.path.join(".") as keyof T;
        zodErrors[path] = error.message;
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
      submitOptions: SubmitOptions<T> = {},
    ) => {
      clearErrors();

      if (!runValidation()) return;

      setProcessing(true);
      abortController.current = new AbortController();

      try {
        let response: ApiResponse<T>;

        const needsAuth = submitOptions.requireAuth ?? options.requireAuth ?? true;
        const shouldAuth = needsAuth && token;

        const requestOptions = {
          signal: abortController.current.signal,
          ...(shouldAuth && { token }),
          requireAuth: needsAuth,
        };

        response = await (method === "get" || method === "delete"
          ? http[method]<T>(url, requestOptions)
          : http[method]<T>(url, data, requestOptions));

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
    [data, runValidation, clearErrors, options.requireAuth, token],
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
    get: (url: string, options_?: SubmitOptions<T>) => submit("get", url, options_),
    post: (url: string, options_?: SubmitOptions<T>) => submit("post", url, options_),
    put: (url: string, options_?: SubmitOptions<T>) => submit("put", url, options_),
    patch: (url: string, options_?: SubmitOptions<T>) => submit("patch", url, options_),
    delete: (url: string, options_?: SubmitOptions<T>) => submit("delete", url, options_),
  };
}
