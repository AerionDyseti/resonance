import type { EntityId, WorldId, EntityDefinitionId, TagId } from '../shared/ids';
import { createEntityId } from '../shared/ids';
import { Property, type IProperty } from './property';
import type { EntitySummary } from './entity-summary';

/**
 * Entity interface - the public data shape
 */
export interface IEntity {
  readonly id: EntityId;
  readonly worldId: WorldId;
  readonly definitionId: EntityDefinitionId;
  readonly name: string;
  readonly slug: string;
  readonly aliases: readonly string[];
  readonly summary: string | null;
  readonly body: string;
  readonly imageUrl: string | null;
  readonly properties: readonly IProperty[];
  readonly tagIds: readonly TagId[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Entity Domain Entity
 * An instance of an EntityDefinition with specific property values
 */
export class Entity implements IEntity {
  private constructor(
    public readonly id: EntityId,
    public readonly worldId: WorldId,
    public readonly definitionId: EntityDefinitionId,
    private _name: string,
    private _slug: string,
    private _aliases: string[],
    private _summary: string | null,
    private _body: string,
    private _imageUrl: string | null,
    private _properties: Property[],
    private _tagIds: TagId[],
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  private static validateName(name: string): string {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Entity name cannot be empty');
    }
    return trimmedName;
  }

  private static validateSlug(slug: string): string {
    const trimmedSlug = slug.trim().toLowerCase();
    if (trimmedSlug.length === 0) {
      throw new Error('Entity slug cannot be empty');
    }
    return trimmedSlug;
  }

  /**
   * Create a new Entity
   * Generates ID and timestamps, validates business rules
   */
  static create(params: {
    worldId: WorldId;
    definitionId: EntityDefinitionId;
    name: string;
    slug: string;
    aliases?: string[];
    summary?: string;
    body?: string;
    imageUrl?: string;
    properties?: Property[];
    tagIds?: TagId[];
  }): Entity {
    const now = new Date();
    return new Entity(
      createEntityId(),
      params.worldId,
      params.definitionId,
      Entity.validateName(params.name),
      Entity.validateSlug(params.slug),
      params.aliases?.map((a) => a.trim()).filter((a) => a.length > 0) ?? [],
      params.summary?.trim() || null,
      params.body ?? '',
      params.imageUrl?.trim() || null,
      params.properties ?? [],
      params.tagIds ?? [],
      now,
      now
    );
  }

  /**
   * Reconstitute an existing Entity from stored data
   * Used by adapters when loading from database
   * Validates to ensure data integrity
   */
  static existing(data: IEntity): Entity {
    return new Entity(
      data.id,
      data.worldId,
      data.definitionId,
      Entity.validateName(data.name),
      Entity.validateSlug(data.slug),
      [...data.aliases],
      data.summary?.trim() ?? null,
      data.body,
      data.imageUrl?.trim() ?? null,
      data.properties.map((p) => Property.existing(p)),
      [...data.tagIds],
      data.createdAt,
      data.updatedAt
    );
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get aliases(): readonly string[] {
    return this._aliases;
  }

  get summary(): string | null {
    return this._summary;
  }

  get body(): string {
    return this._body;
  }

  get imageUrl(): string | null {
    return this._imageUrl;
  }

  get properties(): readonly Property[] {
    return this._properties;
  }

  get tagIds(): readonly TagId[] {
    return this._tagIds;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Convert to lightweight EntitySummary projection
   * Used by Intelligence domain for context management
   */
  toSummary(): EntitySummary {
    return {
      id: this.id,
      name: this.name,
      definitionId: this.definitionId,
      summary: this.summary,
    };
  }
}
