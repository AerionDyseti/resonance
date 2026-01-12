import type { UserId } from '../shared/ids';
import { createUserId } from '../shared/ids';

/**
 * User interface - the public data shape
 * Used by repositories and external layers
 */
export interface IUser {
  readonly id: UserId;
  readonly displayName: string;
  readonly email: string;
  readonly avatarUrl: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * User Domain Entity
 * Lightweight user for world ownership (auth is infrastructure concern)
 */
export class User implements IUser {
  private constructor(
    public readonly id: UserId,
    private _displayName: string,
    private _email: string,
    private _avatarUrl: string | null,
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  private static validateDisplayName(name: string): string {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Display name cannot be empty');
    }
    return trimmedName;
  }

  private static validateEmail(email: string): string {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.includes('@')) {
      throw new Error('Invalid email format');
    }
    return trimmedEmail;
  }

  /**
   * Create a new User
   * Generates ID and timestamps, validates business rules
   */
  static create(params: { displayName: string; email: string; avatarUrl?: string }): User {
    const now = new Date();
    return new User(
      createUserId(),
      User.validateDisplayName(params.displayName),
      User.validateEmail(params.email),
      params.avatarUrl?.trim() || null,
      now,
      now
    );
  }

  /**
   * Reconstitute an existing User from stored data
   * Used by adapters when loading from database
   * Validates to ensure data integrity
   */
  static existing(data: IUser): User {
    return new User(
      data.id,
      User.validateDisplayName(data.displayName),
      User.validateEmail(data.email),
      data.avatarUrl?.trim() ?? null,
      data.createdAt,
      data.updatedAt
    );
  }

  get displayName(): string {
    return this._displayName;
  }

  get email(): string {
    return this._email;
  }

  get avatarUrl(): string | null {
    return this._avatarUrl;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
