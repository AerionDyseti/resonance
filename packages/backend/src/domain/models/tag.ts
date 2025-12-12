import type { TagId, WorldId } from '../value-objects/ids';
import { createTagId, tagId, worldId } from '../value-objects/ids';

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

export interface TagPersistenceRecord {
  id: string;
  worldId: string;
  name: string;
  color: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
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

  static create(params: {
    worldId: WorldId;
    name: string;
    color?: string;
    description?: string;
  }): Tag {
    const trimmedName = params.name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Tag name cannot be empty');
    }

    const now = new Date();
    return new Tag(
      createTagId(),
      params.worldId,
      trimmedName,
      params.color?.trim() || null,
      params.description?.trim() || null,
      now,
      now
    );
  }

  static fromPersistence(record: TagPersistenceRecord): Tag {
    return new Tag(
      tagId(record.id),
      worldId(record.worldId),
      record.name,
      record.color,
      record.description,
      record.createdAt,
      record.updatedAt
    );
  }

  toPersistence(): TagPersistenceRecord {
    return {
      id: this.id,
      worldId: this.worldId,
      name: this._name,
      color: this._color,
      description: this._description,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
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
