export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>;
  public digest?: string;

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

  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  isUnauthorized(): boolean {
    return this.statusCode === 401 || this.statusCode === 419;
  }

  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  isValidationError(): boolean {
    return this.statusCode === 422;
  }
}
