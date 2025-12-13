/**
 * Base class for all application-layer errors
 * Provides a consistent structure for error handling across use cases
 */
export abstract class ApplicationError extends Error {
  /** Machine-readable error code (e.g., 'NOT_FOUND', 'CONFLICT') */
  abstract readonly code: string;

  /** HTTP status code for REST/tRPC mapping */
  abstract readonly httpStatus: number;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Maintains proper stack trace in V8 (Node.js)
    Error.captureStackTrace?.(this, this.constructor);
  }

  /**
   * Converts the error to a JSON-serializable object
   * Useful for API responses
   */
  toJSON(): { code: string; message: string } {
    return {
      code: this.code,
      message: this.message,
    };
  }
}
