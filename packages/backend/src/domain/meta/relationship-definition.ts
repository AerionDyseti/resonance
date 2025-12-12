import type {
  RelationshipDefinitionId,
  WorldId,
  EntityDefinitionId,
  PropertyDefinitionId,
} from '../shared/ids';
import { createRelationshipDefinitionId } from '../shared/ids';

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

  private static validateName(name: string): string {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('RelationshipDefinition name cannot be empty');
    }
    return trimmedName;
  }

  /**
   * Create a new RelationshipDefinition
   * Generates ID and timestamps, validates business rules
   */
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
    const now = new Date();
    return new RelationshipDefinition(
      createRelationshipDefinitionId(),
      params.worldId,
      RelationshipDefinition.validateName(params.name),
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

  /**
   * Reconstitute an existing RelationshipDefinition from stored data
   * Used by adapters when loading from database
   * Validates to ensure data integrity
   */
  static existing(data: IRelationshipDefinition): RelationshipDefinition {
    return new RelationshipDefinition(
      data.id,
      data.worldId,
      RelationshipDefinition.validateName(data.name),
      data.description?.trim() ?? null,
      data.inverseName?.trim() ?? null,
      data.isSymmetric,
      data.sourceEntityDefinitionId,
      data.targetEntityDefinitionId,
      [...data.propertyDefinitionIds],
      data.createdAt,
      data.updatedAt
    );
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
