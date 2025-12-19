import { ApplicationError } from './application-error';

/**
 * Error thrown when a requested resource cannot be found
 * Maps to HTTP 404
 */
export class NotFoundError extends ApplicationError {
  readonly code = 'NOT_FOUND' as const;
  readonly httpStatus = 404;

  /** The type of resource that wasn't found */
  readonly resourceType: string;

  /** The identifier used to search for the resource */
  readonly resourceId: string;

  constructor(resourceType: string, resourceId: string) {
    super(`${resourceType} with id '${resourceId}' not found`);
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }

  override toJSON(): { code: string; message: string; resourceType: string; resourceId: string } {
    return {
      ...super.toJSON(),
      resourceType: this.resourceType,
      resourceId: this.resourceId,
    };
  }
}
