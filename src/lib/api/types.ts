export interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | Record<string, unknown> | unknown[];
  requireAuth?: boolean;
  token?: string;
  parseJson?: boolean;
}
