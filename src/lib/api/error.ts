export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>;
  public digest?: string;

  /**
   * @param message   Human-readable error description
   * @param statusCode HTTP status code
   * @param errors     Optional structured error details returned by API
   * @param digest     Optional unique digest/request ID for tracing
   */
  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>,
    digest?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.digest = digest;
  }

  /**
   * Returns true if the error is a "Forbidden" (HTTP 403).
   */
  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Returns true if the error is "Unauthorized" (HTTP 401 or 419).
   */
  isUnauthorized(): boolean {
    return this.statusCode === 401 || this.statusCode === 419;
  }

  /**
   * Returns true if the error is "Not Found" (HTTP 404).
   */
  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Returns true if the error is an internal server error (5xx).
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /**
   * Returns true if the error is a validation error (HTTP 422).
   */
  isValidationError(): boolean {
    return this.statusCode === 422;
  }
}
