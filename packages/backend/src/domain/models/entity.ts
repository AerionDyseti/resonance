import type { EntityId, WorldId, EntityDefinitionId, TagId } from '../value-objects/ids';
import { createEntityId, entityId, worldId, entityDefinitionId, tagId } from '../value-objects/ids';
import { Property, type IProperty, type PropertyPersistenceRecord } from './property';

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

export interface EntityPersistenceRecord {
  id: string;
  worldId: string;
  definitionId: string;
  name: string;
  slug: string;
  aliases: string[];
  summary: string | null;
  body: string;
  imageUrl: string | null;
  properties: PropertyPersistenceRecord[];
  tagIds: string[];
  createdAt: Date;
  updatedAt: Date;
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
    const trimmedName = params.name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Entity name cannot be empty');
    }

    const trimmedSlug = params.slug.trim().toLowerCase();
    if (trimmedSlug.length === 0) {
      throw new Error('Entity slug cannot be empty');
    }

    const now = new Date();
    return new Entity(
      createEntityId(),
      params.worldId,
      params.definitionId,
      trimmedName,
      trimmedSlug,
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

  static fromPersistence(record: EntityPersistenceRecord): Entity {
    return new Entity(
      entityId(record.id),
      worldId(record.worldId),
      entityDefinitionId(record.definitionId),
      record.name,
      record.slug,
      record.aliases,
      record.summary,
      record.body,
      record.imageUrl,
      record.properties.map(Property.fromPersistence),
      record.tagIds.map(tagId),
      record.createdAt,
      record.updatedAt
    );
  }

  toPersistence(): EntityPersistenceRecord {
    return {
      id: this.id,
      worldId: this.worldId,
      definitionId: this.definitionId,
      name: this._name,
      slug: this._slug,
      aliases: this._aliases,
      summary: this._summary,
      body: this._body,
      imageUrl: this._imageUrl,
      properties: this._properties.map((p) => p.toPersistence()),
      tagIds: this._tagIds.map((id) => id as string),
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
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
}
