import type { WorldId } from '@resonance/shared';
import { createWorldId, worldId } from '@resonance/shared';

/**
 * Persistence shape for reconstituting/saving Worlds.
 *
 * This lives in core so the domain does not depend on any specific database schema/ORM.
 */
export interface WorldPersistenceRecord {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * World Domain Entity
 *
 * Represents a top-level container for all worldbuilding content.
 * Encapsulates business rules for world management.
 */
export class World {
  private constructor(
    public readonly id: WorldId,
    private _name: string,
    private _description: string | null,
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  /**
   * Factory method to create a new World
   * Enforces business rules during creation
   */
  static create(params: { name: string; description?: string }): World {
    // Business rule: World name cannot be empty
    const trimmedName = params.name.trim();
    if (trimmedName.length === 0) {
      throw new Error('World name cannot be empty');
    }

    // Business rule: World name cannot exceed 255 characters
    if (trimmedName.length > 255) {
      throw new Error('World name cannot exceed 255 characters');
    }

    const now = new Date();
    return new World(createWorldId(), trimmedName, params.description?.trim() || null, now, now);
  }

  /**
   * Reconstitute a World entity from database record
   * Used by repository when loading from database
   */
  static fromPersistence(record: WorldPersistenceRecord): World {
    return new World(
      worldId(record.id),
      record.name,
      record.description,
      record.createdAt,
      record.updatedAt
    );
  }

  /**
   * Convert entity to database record
   * Used by repository when persisting to database
   */
  toPersistence(): WorldPersistenceRecord {
    return {
      id: this.id,
      name: this._name,
      description: this._description,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
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
