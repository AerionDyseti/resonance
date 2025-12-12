import type {
  RelationshipDefinitionId,
  WorldId,
  EntityDefinitionId,
  PropertyDefinitionId,
} from '../value-objects/ids';
import {
  createRelationshipDefinitionId,
  relationshipDefinitionId,
  worldId,
  entityDefinitionId,
  propertyDefinitionId,
} from '../value-objects/ids';

/**
 * RelationshipDefinition interface - the public data shape
 */
export interface IRelationshipDefinition {
  readonly id: RelationshipDefinitionId;
  readonly worldId: WorldId;
  readonly name: string;
  readonly description: string | null;
  readonly inverseName: string | null;
  readonly isSymmetric: boolean;
  readonly sourceEntityDefinitionId: EntityDefinitionId | null;
  readonly targetEntityDefinitionId: EntityDefinitionId | null;
  readonly propertyDefinitionIds: readonly PropertyDefinitionId[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface RelationshipDefinitionPersistenceRecord {
  id: string;
  worldId: string;
  name: string;
  description: string | null;
  inverseName: string | null;
  isSymmetric: boolean;
  sourceEntityDefinitionId: string | null;
  targetEntityDefinitionId: string | null;
  propertyDefinitionIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * RelationshipDefinition Domain Entity
 * A user-defined relationship type with optional constraints
 */
export class RelationshipDefinition implements IRelationshipDefinition {
  private constructor(
    public readonly id: RelationshipDefinitionId,
    public readonly worldId: WorldId,
    private _name: string,
    private _description: string | null,
    private _inverseName: string | null,
    private _isSymmetric: boolean,
    private _sourceEntityDefinitionId: EntityDefinitionId | null,
    private _targetEntityDefinitionId: EntityDefinitionId | null,
    private _propertyDefinitionIds: PropertyDefinitionId[],
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(params: {
    worldId: WorldId;
    name: string;
    description?: string;
    inverseName?: string;
    isSymmetric?: boolean;
    sourceEntityDefinitionId?: EntityDefinitionId;
    targetEntityDefinitionId?: EntityDefinitionId;
    propertyDefinitionIds?: PropertyDefinitionId[];
  }): RelationshipDefinition {
    const trimmedName = params.name.trim();
    if (trimmedName.length === 0) {
      throw new Error('RelationshipDefinition name cannot be empty');
    }

    const now = new Date();
    return new RelationshipDefinition(
      createRelationshipDefinitionId(),
      params.worldId,
      trimmedName,
      params.description?.trim() || null,
      params.inverseName?.trim() || null,
      params.isSymmetric ?? false,
      params.sourceEntityDefinitionId ?? null,
      params.targetEntityDefinitionId ?? null,
      params.propertyDefinitionIds ?? [],
      now,
      now
    );
  }

  static fromPersistence(record: RelationshipDefinitionPersistenceRecord): RelationshipDefinition {
    return new RelationshipDefinition(
      relationshipDefinitionId(record.id),
      worldId(record.worldId),
      record.name,
      record.description,
      record.inverseName,
      record.isSymmetric,
      record.sourceEntityDefinitionId ? entityDefinitionId(record.sourceEntityDefinitionId) : null,
      record.targetEntityDefinitionId ? entityDefinitionId(record.targetEntityDefinitionId) : null,
      record.propertyDefinitionIds.map(propertyDefinitionId),
      record.createdAt,
      record.updatedAt
    );
  }

  toPersistence(): RelationshipDefinitionPersistenceRecord {
    return {
      id: this.id,
      worldId: this.worldId,
      name: this._name,
      description: this._description,
      inverseName: this._inverseName,
      isSymmetric: this._isSymmetric,
      sourceEntityDefinitionId: this._sourceEntityDefinitionId as string | null,
      targetEntityDefinitionId: this._targetEntityDefinitionId as string | null,
      propertyDefinitionIds: this._propertyDefinitionIds.map((id) => id as string),
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get inverseName(): string | null {
    return this._inverseName;
  }

  get isSymmetric(): boolean {
    return this._isSymmetric;
  }

  get sourceEntityDefinitionId(): EntityDefinitionId | null {
    return this._sourceEntityDefinitionId;
  }

  get targetEntityDefinitionId(): EntityDefinitionId | null {
    return this._targetEntityDefinitionId;
  }

  get propertyDefinitionIds(): readonly PropertyDefinitionId[] {
    return this._propertyDefinitionIds;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
