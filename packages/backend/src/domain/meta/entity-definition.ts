import type { EntityDefinitionId, WorldId, PropertyDefinitionId } from '../shared/ids';
import { createEntityDefinitionId } from '../shared/ids';

/**
 * EntityDefinition interface - the public data shape
 */
export interface IEntityDefinition {
  readonly id: EntityDefinitionId;
  readonly worldId: WorldId;
  readonly name: string;
  readonly description: string | null;
  readonly icon: string | null;
  readonly propertyDefinitionIds: readonly PropertyDefinitionId[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * EntityDefinition Domain Entity
 * A schema that defines what properties an entity can have
 */
export class EntityDefinition implements IEntityDefinition {
  private constructor(
    public readonly id: EntityDefinitionId,
    public readonly worldId: WorldId,
    private _name: string,
    private _description: string | null,
    private _icon: string | null,
    private _propertyDefinitionIds: PropertyDefinitionId[],
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  private static validateName(name: string): string {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('EntityDefinition name cannot be empty');
    }
    return trimmedName;
  }

  /**
   * Create a new EntityDefinition
   * Generates ID and timestamps, validates business rules
   */
  static create(params: {
    worldId: WorldId;
    name: string;
    description?: string;
    icon?: string;
    propertyDefinitionIds?: PropertyDefinitionId[];
  }): EntityDefinition {
    const now = new Date();
    return new EntityDefinition(
      createEntityDefinitionId(),
      params.worldId,
      EntityDefinition.validateName(params.name),
      params.description?.trim() || null,
      params.icon?.trim() || null,
      params.propertyDefinitionIds ?? [],
      now,
      now
    );
  }

  /**
   * Reconstitute an existing EntityDefinition from stored data
   * Used by adapters when loading from database
   * Validates to ensure data integrity
   */
  static existing(data: IEntityDefinition): EntityDefinition {
    return new EntityDefinition(
      data.id,
      data.worldId,
      EntityDefinition.validateName(data.name),
      data.description?.trim() ?? null,
      data.icon?.trim() ?? null,
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

  get icon(): string | null {
    return this._icon;
  }

  get propertyDefinitionIds(): readonly PropertyDefinitionId[] {
    return this._propertyDefinitionIds;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
