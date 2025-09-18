export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiSuccess<T> = {
  status: "success";
  message: string;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  status: "error";
  message: string;
  errors?: Record<string, unknown>;
  data?: unknown;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, unknown> | unknown[];
  requireAuth?: boolean;
  token?: string;
  parseJson?: boolean;
}
