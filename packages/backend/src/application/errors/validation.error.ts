import { ApplicationError } from './application-error';

/**
 * Represents a single validation failure
 */
export interface ValidationIssue {
  /** The field path that failed validation (e.g., 'name', 'properties.0.value') */
  path: string;
  /** Human-readable description of the validation failure */
  message: string;
}

/**
 * Error thrown when input validation fails
 * Maps to HTTP 400
 */
export class ValidationError extends ApplicationError {
  readonly code = 'VALIDATION_ERROR' as const;
  readonly httpStatus = 400;

  /** List of validation issues */
  readonly issues: ValidationIssue[];

  constructor(issues: ValidationIssue[]) {
    const message =
      issues.length === 1
        ? `Validation failed: ${issues[0].path} - ${issues[0].message}`
        : `Validation failed with ${issues.length} issues`;
    super(message);
    this.issues = issues;
  }

  /**
   * Create a ValidationError from a single field issue
   */
  static fromField(path: string, message: string): ValidationError {
    return new ValidationError([{ path, message }]);
  }

  override toJSON(): { code: string; message: string; issues: ValidationIssue[] } {
    return {
      ...super.toJSON(),
      issues: this.issues,
    };
  }
}
