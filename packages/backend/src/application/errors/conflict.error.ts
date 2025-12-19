import { ApplicationError } from './application-error';

/**
 * Error thrown when an operation conflicts with existing state
 * Examples: duplicate name, resource already exists
 * Maps to HTTP 409
 */
export class ConflictError extends ApplicationError {
  readonly code = 'CONFLICT' as const;
  readonly httpStatus = 409;

  /** The type of resource involved in the conflict */
  readonly resourceType: string;

  /** The field that caused the conflict (e.g., 'name', 'email') */
  readonly conflictField: string;

  /** The value that caused the conflict */
  readonly conflictValue: string;

  constructor(resourceType: string, conflictField: string, conflictValue: string) {
    super(`${resourceType} with ${conflictField} '${conflictValue}' already exists`);
    this.resourceType = resourceType;
    this.conflictField = conflictField;
    this.conflictValue = conflictValue;
  }

  override toJSON(): {
    code: string;
    message: string;
    resourceType: string;
    conflictField: string;
    conflictValue: string;
  } {
    return {
      ...super.toJSON(),
      resourceType: this.resourceType,
      conflictField: this.conflictField,
      conflictValue: this.conflictValue,
    };
  }
}
