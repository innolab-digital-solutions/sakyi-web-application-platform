/* eslint-disable no-commented-code/no-commented-code */

/**
 * Custom error class for API request failures
 *
 * Extends native Error with HTTP status codes, structured validation
 * errors, and request tracing support. Provides helper methods for
 * common HTTP status checks.
 */
export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>;
  public digest?: string;

  /**
   * Creates an API error instance
   *
   * @param message - Human-readable error description
   * @param statusCode - HTTP status code
   * @param errors - Structured validation errors from API (field → messages)
   * @param digest - Request ID for error tracking/debugging
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
   * Checks if error is Forbidden (403)
   */
  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  /**
   * Checks if error is Unauthorized (401 or 419 CSRF)
   */
  isUnauthorized(): boolean {
    return this.statusCode === 401 || this.statusCode === 419;
  }

  /**
   * Checks if error is Not Found (404)
   */
  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  /**
   * Checks if error is server error (5xx)
   */
  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  /**
   * Checks if error is validation error (422)
   */
  isValidationError(): boolean {
    return this.statusCode === 422;
  }
}
