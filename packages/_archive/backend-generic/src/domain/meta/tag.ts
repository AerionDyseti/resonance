import type { TagId, WorldId } from '../shared/ids';
import { createTagId } from '../shared/ids';

/**
 * Tag interface - the public data shape
 */
export interface ITag {
  readonly id: TagId;
  readonly worldId: WorldId;
  readonly name: string;
  readonly color: string | null;
  readonly description: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Tag Domain Entity
 * A world-scoped label that can be applied to entities
 */
export class Tag implements ITag {
  private constructor(
    public readonly id: TagId,
    public readonly worldId: WorldId,
    private _name: string,
    private _color: string | null,
    private _description: string | null,
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  private static validateName(name: string): string {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Tag name cannot be empty');
    }
    return trimmedName;
  }

  /**
   * Create a new Tag
   * Generates ID and timestamps, validates business rules
   */
  static create(params: {
    worldId: WorldId;
    name: string;
    color?: string;
    description?: string;
  }): Tag {
    const now = new Date();
    return new Tag(
      createTagId(),
      params.worldId,
      Tag.validateName(params.name),
      params.color?.trim() || null,
      params.description?.trim() || null,
      now,
      now
    );
  }

  /**
   * Reconstitute an existing Tag from stored data
   * Used by adapters when loading from database
   * Validates to ensure data integrity
   */
  static existing(data: ITag): Tag {
    return new Tag(
      data.id,
      data.worldId,
      Tag.validateName(data.name),
      data.color?.trim() ?? null,
      data.description?.trim() ?? null,
      data.createdAt,
      data.updatedAt
    );
  }

  get name(): string {
    return this._name;
  }

  get color(): string | null {
    return this._color;
  }

  get description(): string | null {
    return this._description;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
