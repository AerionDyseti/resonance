import type { WorldId, UserId } from '../shared/ids';
import { createWorldId } from '../shared/ids';

/**
 * World interface - the public data shape
 * Used by repositories and external layers
 */
export interface IWorld {
  readonly id: WorldId;
  readonly ownerId: UserId;
  readonly name: string;
  readonly description: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * World Domain Entity
 *
 * Represents a top-level container for all worldbuilding content.
 * Encapsulates business rules for world management.
 */
export class World implements IWorld {
  private constructor(
    public readonly id: WorldId,
    public readonly ownerId: UserId,
    private _name: string,
    private _description: string | null,
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  /**
   * Validate world name against business rules
   */
  private static validateName(name: string): string {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('World name cannot be empty');
    }
    if (trimmedName.length > 255) {
      throw new Error('World name cannot exceed 255 characters');
    }
    return trimmedName;
  }

  /**
   * Create a new World
   * Generates ID and timestamps, validates business rules
   */
  static create(params: { ownerId: UserId; name: string; description?: string }): World {
    const now = new Date();
    return new World(
      createWorldId(),
      params.ownerId,
      World.validateName(params.name),
      params.description?.trim() || null,
      now,
      now
    );
  }

  /**
   * Reconstitute an existing World from stored data
   * Used by adapters when loading from database
   * Validates to ensure data integrity
   */
  static existing(data: IWorld): World {
    return new World(
      data.id,
      data.ownerId,
      World.validateName(data.name),
      data.description?.trim() ?? null,
      data.createdAt,
      data.updatedAt
    );
  }

  /**
   * Update the world's name
   * Enforces business rules
   */
  updateName(newName: string): void {
    const trimmedName = newName.trim();

    if (trimmedName.length === 0) {
      throw new Error('World name cannot be empty');
    }

    if (trimmedName.length > 255) {
      throw new Error('World name cannot exceed 255 characters');
    }

    this._name = trimmedName;
    this._updatedAt = new Date();
  }

  /**
   * Update the world's description
   */
  updateDescription(newDescription: string | null): void {
    this._description = newDescription?.trim() || null;
    this._updatedAt = new Date();
  }

  /**
   * Update both name and description atomically
   */
  update(params: { name?: string; description?: string | null }): void {
    if (params.name !== undefined) {
      this.updateName(params.name);
    }

    if (params.description !== undefined) {
      this.updateDescription(params.description);
    }

    // updatedAt is already set by individual update methods
  }

  // Getters for encapsulated properties
  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Check if this world was created recently (within last 24 hours)
   * Example of domain logic that belongs in the entity
   */
  isNew(): boolean {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.createdAt > twentyFourHoursAgo;
  }

  /**
   * Get a human-readable summary of the world
   */
  getSummary(): string {
    const desc = this._description
      ? ` - ${this._description.substring(0, 100)}${this._description.length > 100 ? '...' : ''}`
      : '';
    return `${this._name}${desc}`;
  }
}
