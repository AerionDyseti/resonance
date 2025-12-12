import type {
  RelationshipId,
  WorldId,
  RelationshipDefinitionId,
  EntityId,
} from '../value-objects/ids';
import {
  createRelationshipId,
  relationshipId,
  worldId,
  relationshipDefinitionId,
  entityId,
} from '../value-objects/ids';
import { Property, type IProperty, type PropertyPersistenceRecord } from './property';

/**
 * Relationship interface - the public data shape
 */
export interface IRelationship {
  readonly id: RelationshipId;
  readonly worldId: WorldId;
  readonly definitionId: RelationshipDefinitionId;
  readonly sourceEntityId: EntityId;
  readonly targetEntityId: EntityId;
  readonly properties: readonly IProperty[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface RelationshipPersistenceRecord {
  id: string;
  worldId: string;
  definitionId: string;
  sourceEntityId: string;
  targetEntityId: string;
  properties: PropertyPersistenceRecord[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Relationship Domain Entity
 * An instance of a RelationshipDefinition connecting two entities
 */
export class Relationship implements IRelationship {
  private constructor(
    public readonly id: RelationshipId,
    public readonly worldId: WorldId,
    public readonly definitionId: RelationshipDefinitionId,
    public readonly sourceEntityId: EntityId,
    public readonly targetEntityId: EntityId,
    private _properties: Property[],
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(params: {
    worldId: WorldId;
    definitionId: RelationshipDefinitionId;
    sourceEntityId: EntityId;
    targetEntityId: EntityId;
    properties?: Property[];
  }): Relationship {
    const now = new Date();
    return new Relationship(
      createRelationshipId(),
      params.worldId,
      params.definitionId,
      params.sourceEntityId,
      params.targetEntityId,
      params.properties ?? [],
      now,
      now
    );
  }

  static fromPersistence(record: RelationshipPersistenceRecord): Relationship {
    return new Relationship(
      relationshipId(record.id),
      worldId(record.worldId),
      relationshipDefinitionId(record.definitionId),
      entityId(record.sourceEntityId),
      entityId(record.targetEntityId),
      record.properties.map(Property.fromPersistence),
      record.createdAt,
      record.updatedAt
    );
  }

  toPersistence(): RelationshipPersistenceRecord {
    return {
      id: this.id,
      worldId: this.worldId,
      definitionId: this.definitionId,
      sourceEntityId: this.sourceEntityId,
      targetEntityId: this.targetEntityId,
      properties: this._properties.map((p) => p.toPersistence()),
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }

  get properties(): readonly Property[] {
    return this._properties;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
