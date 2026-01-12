import type { RelationshipId, WorldId, RelationshipDefinitionId, EntityId } from '../shared/ids';
import { createRelationshipId } from '../shared/ids';
import { Property, type IProperty } from './property';
import type { RelationshipSummary } from './relationship-summary';

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

  /**
   * Create a new Relationship
   * Generates ID and timestamps
   */
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

  /**
   * Reconstitute an existing Relationship from stored data
   * Used by adapters when loading from database
   */
  static existing(data: IRelationship): Relationship {
    return new Relationship(
      data.id,
      data.worldId,
      data.definitionId,
      data.sourceEntityId,
      data.targetEntityId,
      data.properties.map((p) => Property.existing(p)),
      data.createdAt,
      data.updatedAt
    );
  }

  get properties(): readonly Property[] {
    return this._properties;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Convert to lightweight RelationshipSummary projection
   * Used by Intelligence domain for graph traversal
   *
   * @param definitionName - The name of the relationship definition (caller must provide this)
   * @param description - Optional relationship description
   */
  toSummary(definitionName: string, description: string | null = null): RelationshipSummary {
    return {
      id: this.id,
      sourceEntityId: this.sourceEntityId,
      targetEntityId: this.targetEntityId,
      definitionName,
      description,
    };
  }
}
