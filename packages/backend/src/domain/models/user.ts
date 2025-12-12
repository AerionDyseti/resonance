import type { UserId } from '../value-objects/ids';
import { createUserId, userId } from '../value-objects/ids';

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
 * Persistence shape for User
 */
export interface UserPersistenceRecord {
  id: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
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

  static create(params: { displayName: string; email: string; avatarUrl?: string }): User {
    const trimmedName = params.displayName.trim();
    if (trimmedName.length === 0) {
      throw new Error('Display name cannot be empty');
    }

    const trimmedEmail = params.email.trim().toLowerCase();
    if (!trimmedEmail.includes('@')) {
      throw new Error('Invalid email format');
    }

    const now = new Date();
    return new User(
      createUserId(),
      trimmedName,
      trimmedEmail,
      params.avatarUrl?.trim() || null,
      now,
      now
    );
  }

  static fromPersistence(record: UserPersistenceRecord): User {
    return new User(
      userId(record.id),
      record.displayName,
      record.email,
      record.avatarUrl,
      record.createdAt,
      record.updatedAt
    );
  }

  toPersistence(): UserPersistenceRecord {
    return {
      id: this.id,
      displayName: this._displayName,
      email: this._email,
      avatarUrl: this._avatarUrl,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
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
